/**
 * ConGen Gemini TTS Service
 * Gemini TTS 전용 서비스
 */

import { GoogleGenAI } from "@google/genai";
import type { SubtitleData, MeaningChunk, SubtitleWord } from "../types";
import { splitSubtitleByMeaning } from "./geminiService";

/**
 * API 키 가져오기 (환경변수 우선, localStorage 폴백)
 */
function getGeminiApiKey(): string {
  return process.env.GEMINI_API_KEY ||
         localStorage.getItem('congen_gemini_api_key') ||
         localStorage.getItem('tubegen_el_key') || // 기존 키 호환
         '';
}

/**
 * Gemini TTS로 오디오 생성
 *
 * @param text - 변환할 텍스트
 * @param voiceName - Gemini TTS 음성 이름 (기본: 'Kore' - 한국어)
 * @returns base64 오디오 데이터, 추정 길이, 자막 데이터 (null - Gemini는 타임스탬프 미지원)
 */
export async function generateAudioWithGeminiTts(
  text: string,
  voiceName: string = 'Kore'
): Promise<{
  audioData: string;
  audioDuration: number;
  subtitleData: SubtitleData | null;
}> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API 키가 없습니다. 설정에서 API 키를 등록해주세요.');
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName }
          }
        }
      }
    });

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioBase64) {
      throw new Error('Gemini TTS 응답에 오디오 데이터가 없습니다.');
    }

    // PCM 데이터이므로 길이 추정 (24000Hz, 16bit, mono)
    const binaryString = atob(audioBase64);
    const binaryLength = binaryString.length;
    const estimatedDuration = binaryLength / (24000 * 2); // 바이트 / (샘플레이트 * 바이트당비트)

    return {
      audioData: audioBase64,
      audioDuration: estimatedDuration,
      subtitleData: null  // Gemini TTS는 타임스탬프 미지원
    };
  } catch (error) {
    console.error('Gemini TTS 오류:', error);
    throw error;
  }
}

/**
 * Gemini TTS 사용 후 자막 데이터 생성
 *
 * Gemini TTS는 타임스탬프를 지원하지 않으므로,
 * 균등 분배 + AI 의미 분리로 자막을 생성합니다.
 *
 * @param narration - 나레이션 텍스트
 * @param audioDuration - 오디오 길이 (초)
 * @returns 자막 데이터 (단어별 + 의미 단위 청크)
 */
export async function createGeminiTtsSubtitles(
  narration: string,
  audioDuration: number
): Promise<SubtitleData> {
  // 1. AI로 의미 단위 분리
  const chunks = await splitSubtitleByMeaning(narration, 20);

  // 2. 균등하게 타이밍 분배
  const timePerChar = audioDuration / narration.length;
  let currentTime = 0;

  const meaningChunks: MeaningChunk[] = chunks.map(chunkText => {
    const startTime = currentTime;
    const duration = chunkText.length * timePerChar;
    currentTime += duration;
    return {
      text: chunkText,
      startTime,
      endTime: currentTime
    };
  });

  // 3. 단어 단위 타이밍도 생성 (폴백용)
  const words = narration.split(/\s+/).filter(Boolean);
  const timePerWord = audioDuration / words.length;
  const subtitleWords: SubtitleWord[] = words.map((word, i) => ({
    word,
    start: i * timePerWord,
    end: (i + 1) * timePerWord
  }));

  return {
    words: subtitleWords,
    fullText: narration,
    meaningChunks
  };
}

/**
 * Gemini TTS 음성 미리듣기
 *
 * @param text - 테스트할 텍스트
 * @param voiceName - 음성 이름
 * @returns 오디오 Blob URL
 */
export async function previewGeminiVoice(
  text: string = "테스트 목소리입니다",
  voiceName: string = 'Kore'
): Promise<string> {
  const result = await generateAudioWithGeminiTts(text, voiceName);

  // base64를 Blob으로 변환 후 URL 생성
  const binaryString = atob(result.audioData);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}
