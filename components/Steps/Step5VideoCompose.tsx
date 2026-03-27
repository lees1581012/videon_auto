/**
 * ConGen Step5VideoCompose 컴포넌트
 * 5단계: 영상 효과 설정
 */

import React, { useState, useEffect } from 'react';
import { DEFAULT_VIDEO_EFFECTS, CONFIG } from '../../config';
import type { VideoEffectSettings } from '../../types';

export interface Step5VideoComposeProps {
  onStartGeneration: (effects: VideoEffectSettings) => void;
  onPrev: () => void;
}

export const Step5VideoCompose: React.FC<Step5VideoComposeProps> = ({ onStartGeneration, onPrev }) => {
  const [effects, setEffects] = useState<VideoEffectSettings>(DEFAULT_VIDEO_EFFECTS);

  // 저장된 설정 로드
  useEffect(() => {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.VIDEO_EFFECTS);
    if (saved) {
      try {
        setEffects(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved video effects:', e);
      }
    }
  }, []);

  // 변경 시 저장
  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEYS.VIDEO_EFFECTS, JSON.stringify(effects));
  }, [effects]);

  const transitions = [
    { id: 'none', name: '없음' },
    { id: 'fade', name: '페이드' },
    { id: 'crossfade', name: '크로스페이드' },
    { id: 'slide_left', name: '← 슬라이드' },
    { id: 'slide_right', name: '슬라이드 →' },
  ] as const;

  const zoomOptions = [
    { value: 0, label: '끄기' },
    { value: 105, label: '105%' },
    { value: 110, label: '110%' },
    { value: 115, label: '115%' },
  ];

  return (
    <div className="flex h-full">
      {/* 좌측: 효과 설정 패널 */}
      <div className="w-1/2 max-w-xl p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">영상 효과</h1>

        <div className="space-y-6">
          {/* 트랜지션 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">트랜지션</label>
            <div className="grid grid-cols-5 gap-2">
              {transitions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setEffects({ ...effects, transition: t.id })}
                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                    effects.transition === t.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* 자막 번인 */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-white">자막 번인</div>
              <div className="text-sm text-gray-400">나레이션 텍스트를 영상에 삽입</div>
            </div>
            <button
              onClick={() => setEffects({ ...effects, subtitleBurnIn: !effects.subtitleBurnIn })}
              className={`w-12 h-6 rounded-full transition-colors ${
                effects.subtitleBurnIn ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  effects.subtitleBurnIn ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 비네팅 */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-white">비네팅</div>
              <div className="text-sm text-gray-400">화면 가장자리를 어둡게 처리</div>
            </div>
            <button
              onClick={() => setEffects({ ...effects, vignetting: !effects.vignetting })}
              className={`w-12 h-6 rounded-full transition-colors ${
                effects.vignetting ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  effects.vignetting ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 페이드 인/아웃 */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-white">페이드 인/아웃</div>
              <div className="text-sm text-gray-400">각 씬 시작/끝에 부드럽게 전환</div>
            </div>
            <button
              onClick={() => setEffects({ ...effects, fadeInOut: !effects.fadeInOut })}
              className={`w-12 h-6 rounded-full transition-colors ${
                effects.fadeInOut ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  effects.fadeInOut ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 블러 인트로 */}
          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <div className="font-medium text-white">블러 인트로</div>
              <div className="text-sm text-gray-400">씬 시작 시 블러에서 선명해지는 효과</div>
            </div>
            <button
              onClick={() => setEffects({ ...effects, blurIntro: !effects.blurIntro })}
              className={`w-12 h-6 rounded-full transition-colors ${
                effects.blurIntro ? 'bg-orange-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  effects.blurIntro ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* 서서히 확대 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">서서히 확대</label>
            <div className="grid grid-cols-4 gap-2">
              {zoomOptions.map((z) => (
                <button
                  key={z.value}
                  onClick={() => setEffects({ ...effects, slowZoom: z.value })}
                  className={`py-2 px-3 rounded-lg text-sm transition-colors ${
                    effects.slowZoom === z.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              추천: 서서히 확대 5~10%만, 몰입감은 높이고 나머지 효과는 처음엔 빼는 게 안전해요
            </p>
          </div>
        </div>
      </div>

      {/* 우측: 설정 요약 + 시작 버튼 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0A0A0A]">
        <div className="w-full max-w-sm space-y-6">
          {/* 설정 요약 카드 */}
          <div className="p-6 bg-gray-800 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">현재 설정</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">트랜지션</span>
                <span className="text-white">{transitions.find(t => t.id === effects.transition)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">자막 번인</span>
                <span className={effects.subtitleBurnIn ? 'text-orange-400' : 'text-gray-500'}>
                  {effects.subtitleBurnIn ? '켜짐' : '꺼짐'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">비네팅</span>
                <span className={effects.vignetting ? 'text-orange-400' : 'text-gray-500'}>
                  {effects.vignetting ? '켜짐' : '꺼짐'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">페이드</span>
                <span className={effects.fadeInOut ? 'text-orange-400' : 'text-gray-500'}>
                  {effects.fadeInOut ? '켜짐' : '꺼짐'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">블러</span>
                <span className={effects.blurIntro ? 'text-orange-400' : 'text-gray-500'}>
                  {effects.blurIntro ? '켜짐' : '꺼짐'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">서서히 확대</span>
                <span className="text-white">{effects.slowZoom > 0 ? `${effects.slowZoom}%` : '끄기'}</span>
              </div>
            </div>
          </div>

          {/* 영상 생성 시작 버튼 */}
          <button
            onClick={() => onStartGeneration(effects)}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg rounded-xl transition-colors"
          >
            ▶ 영상 생성 시작
          </button>

          {/* 이전 버튼 */}
          <button
            onClick={onPrev}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            ← 이전
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step5VideoCompose;
