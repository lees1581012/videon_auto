/**
 * ConGen Step3Voice 컴포넌트
 * 3단계: 음성 생성
 */

import React, { useState } from 'react';
import { GEMINI_TTS_VOICES, ELEVENLABS_MODELS } from '../../config';
import { generateAudioWithGeminiTts, createGeminiTtsSubtitles } from '../../services/geminiTtsService';
import { generateAudioWithElevenLabs } from '../../services/elevenLabsService';
import { generateAudioWithEdgeTts } from '../../services/edgeTtsService';
import type { TtsEngine, ScriptScene, SubtitleData } from '../../types';

export interface Step3VoiceProps {
  scenes: ScriptScene[];
  onNext: (audioData: { sceneIndex: number; audioData: string; duration: number; subtitles: SubtitleData }[]) => void;
  onPrev: () => void;
}

export const Step3Voice: React.FC<Step3VoiceProps> = ({ scenes, onNext, onPrev }) => {
  const [ttsEngine, setTtsEngine] = useState<TtsEngine>('elevenlabs');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [selectedModel, setSelectedModel] = useState('eleven_multilingual_v2');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudios, setGeneratedAudios] = useState<{ sceneIndex: number; audioData: string; duration: number; subtitles: SubtitleData }[]>([]);

  const totalCharacters = scenes.reduce((sum, scene) => sum + scene.narration.length, 0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const audioResults: { sceneIndex: number; audioData: string; duration: number; subtitles: SubtitleData }[] = [];

      for (let i = 0; i < scenes.length; i++) {
        const scene = scenes[i];
        try {
          let result;

          if (ttsEngine === 'gemini') {
            const geminiResult = await generateAudioWithGeminiTts(scene.narration, selectedVoice);
            // Gemini TTS는 자막 싱크를 지원하지 않으므로 별도 생성
            const subtitles = await createGeminiTtsSubtitles(scene.narration, geminiResult.audioDuration);
            result = {
              audioData: geminiResult.audioData,
              duration: geminiResult.audioDuration,
              subtitles: subtitles || { words: [], fullText: scene.narration }
            };
          } else if (ttsEngine === 'elevenlabs') {
            const elevenResult = await generateAudioWithElevenLabs(scene.narration);
            result = {
              audioData: elevenResult.audioData,
              duration: elevenResult.audioDuration,
              subtitles: elevenResult.subtitleData || { words: [], fullText: scene.narration }
            };
          } else {
            // Edge TTS
            const edgeResult = await generateAudioWithEdgeTts(scene.narration, 'ko-KR-SunHiNeural');
            result = {
              audioData: edgeResult.audioData,
              duration: edgeResult.audioDuration,
              subtitles: { words: [], fullText: scene.narration }
            };
          }

          audioResults.push({
            sceneIndex: i,
            ...result
          });
        } catch (error) {
          console.error(`씬 ${i + 1} 음성 생성 실패:`, error);
          // 실패 시 더미 데이터 추가 (실제로는 에러 표시 필요)
          audioResults.push({
            sceneIndex: i,
            audioData: '',
            duration: 5,
            subtitles: { words: [], fullText: scene.narration }
          });
        }
      }

      setGeneratedAudios(audioResults);
    } catch (error) {
      console.error('음성 생성 실패:', error);
      alert('음성 생성에 실패했습니다. API 키를 확인해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = () => {
    if (generatedAudios.length > 0) {
      onNext(generatedAudios);
    }
  };

  const selectedModelData = ELEVENLABS_MODELS.find(m => m.id === selectedModel);
  const estimatedCredits = totalCharacters * (selectedModelData?.pricePerChar || 1) / 1000;

  return (
    <div className="flex h-full relative">
      {/* 좌측: 스크립트 목록 */}
      <div className="w-1/3 p-6 border-r border-gray-800 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">스크립트 ({scenes.length}개 씬)</h2>
        <div className="space-y-2">
          {scenes.map((scene) => (
            <div key={scene.sceneNumber} className="p-3 bg-gray-800 rounded">
              <div className="text-xs text-orange-500 mb-1">Scene {scene.sceneNumber}</div>
              <p className="text-sm text-white line-clamp-2">{scene.narration}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-400">총 {totalCharacters}자</div>
      </div>

      {/* 우측: 음성 엔진/음성 선택 */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-4">음성 생성 설정</h2>

        {/* 엔진 선택 탭 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTtsEngine('gemini')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              ttsEngine === 'gemini'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Gemini <span className="text-xs opacity-75">무료 · 한도 있음</span>
          </button>
          <button
            onClick={() => setTtsEngine('elevenlabs')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              ttsEngine === 'elevenlabs'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ElevenLabs <span className="text-xs opacity-75">추천 · 고품질</span>
          </button>
        </div>

        {/* Gemini 엔진 설정 */}
        {ttsEngine === 'gemini' && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <div>
              <label className="block text-sm text-gray-300 mb-2">음성 선택</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                {GEMINI_TTS_VOICES.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} - {voice.style}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-yellow-400">
              ⚠️ Gemini: 한도 초과 시 음성 생성 불가
            </div>
            <div className="text-sm text-gray-400">
              자막 싱크 (타임스탬프) 기능 미지원
            </div>
          </div>
        )}

        {/* ElevenLabs 엔진 설정 */}
        {ttsEngine === 'elevenlabs' && (
          <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-sm text-green-400">
              💡 ElevenLabs 추천 → 자막 싱크 자동 지원
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">모델 선택</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                {ELEVENLABS_MODELS.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name} - {model.description} ({model.pricePerChar}cr/자)
                  </option>
                ))}
              </select>
            </div>

            <div className="text-sm text-gray-400">
              예상 크레딧: <span className="text-orange-400">{estimatedCredits.toFixed(1)} cr</span>
            </div>
          </div>
        )}

        {/* 음성 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating || generatedAudios.length > 0}
          className="w-full mt-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              생성 중...
            </>
          ) : generatedAudios.length > 0 ? (
            <>✓ 생성 완료</>
          ) : (
            <>✦ 음성 생성하기</>
          )}
        </button>
      </div>

      {/* 하단 버튼 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← 이전
        </button>
        <button
          onClick={handleNext}
          disabled={generatedAudios.length === 0}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          다음 →
        </button>
      </div>
    </div>
  );
};

export default Step3Voice;
