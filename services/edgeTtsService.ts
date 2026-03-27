// src/services/edgeTtsService.ts
// 로컬 Python edge-tts 서버 연동
import type { SubtitleData } from '../types';

const TTS_SERVER = 'http://localhost:5555';

// ── 음성 목록 ──
export const EDGE_TTS_VOICES = [
  { id: 'ko-KR-SunHiNeural',   name: '선히 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-InJoonNeural',  name: '인준 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-BongJinNeural', name: '봉진 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-GookMinNeural', name: '국민 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-JiMinNeural',   name: '지민 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-SeoHyeonNeural', name: '서현 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-SoonBokNeural', name: '순복 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-YuJinNeural',   name: '유진 (한국어 여성)', lang: 'ko' },
  { id: 'en-US-GuyNeural',     name: 'Guy (English Male)', lang: 'en' },
  { id: 'en-US-JennyNeural',   name: 'Jenny (English Female)', lang: 'en' },
  { id: 'en-US-AriaNeural',    name: 'Aria (English Female)', lang: 'en' },
] as const;

export type EdgeTtsVoiceId = typeof EDGE_TTS_VOICES[number]['id'];

// ── 균등 분할 자막 ──
function buildSimpleSubtitles(text: string, totalDuration: number): SubtitleData {
  const words = text.split(/\s+/).filter(Boolean);
  const timePerWord = words.length > 0 ? totalDuration / words.length : totalDuration;
  const subtitleWords = words.map((word, i) => ({
    word,
    start: i * timePerWord,
    end: (i + 1) * timePerWord,
  }));
  return { words: subtitleWords, fullText: text };
}

// ── 오디오 길이 측정 ──
async function measureDuration(base64Audio: string): Promise<number> {
  try {
    const binaryStr = atob(base64Audio);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));
    const dur = buf.duration;
    ctx.close();
    return dur;
  } catch {
    return 0;
  }
}

// ── 메인 함수 ──
export async function generateAudioWithEdgeTts(
  text: string,
  voiceId: string = 'ko-KR-SunHiNeural'
): Promise<{
  audioData: string;
  subtitleData: SubtitleData;
  audioDuration: number;
}> {
  console.log(`[Edge TTS] 음성 생성 시작: ${voiceId}, 텍스트 길이: ${text.length}자`);

  // 로컬 서버 호출
  const response = await fetch(`${TTS_SERVER}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice: voiceId }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: '서버 응답 오류' }));
    throw new Error(`Edge TTS 서버 오류: ${err.error || response.status}`);
  }

  const result = await response.json();
  const base64Audio: string = result.audioData;

  console.log(`[Edge TTS] 오디오 수신 완료: base64 ${base64Audio.length}자`);

  // 길이 측정
  let duration = await measureDuration(base64Audio);
  if (duration <= 0) {
    duration = Math.max(text.length / 4, 1);
    console.log(`[Edge TTS] 추정 길이: ${duration.toFixed(1)}초`);
  } else {
    console.log(`[Edge TTS] 실제 길이: ${duration.toFixed(1)}초`);
  }

  const subtitleData = buildSimpleSubtitles(text, duration);

  return { audioData: base64Audio, subtitleData, audioDuration: duration };
}
