/**
 * ConGen Step1Settings 컴포넌트
 * 1단계: 영상 설정
 */

import React, { useState, useEffect } from 'react';
import { ModelSelector } from '../Common/ModelSelector';
import { VideoFormatSelector } from '../Common/VideoFormatSelector';
import { CategorySelector } from '../Common/CategorySelector';
import { StyleSelector } from '../Common/StyleSelector';
import { CharacterSelector } from '../Common/CharacterSelector';
import { CONFIG } from '../../config';
import type { ImageModelId, VideoFormat, ContentCategory, ImageStyleId, CharacterConfig } from '../../types';

export interface Step1SettingsProps {
  onNext: () => void;
}

export const Step1Settings: React.FC<Step1SettingsProps> = ({ onNext }) => {
  // 기본값 로드 또는 초기값
  const [imageModel, setImageModel] = useState<ImageModelId>(() => {
    return (localStorage.getItem(CONFIG.STORAGE_KEYS.IMAGE_MODEL) as ImageModelId) || 'nano-banana-2';
  });
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('landscape');
  const [category, setCategory] = useState<ContentCategory>('general');
  const [style, setStyle] = useState<ImageStyleId>('default');
  const [character, setCharacter] = useState<CharacterConfig>({ type: 'none', referenceImages: [] });

  // 변경 시 저장
  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEYS.IMAGE_MODEL, imageModel);
  }, [imageModel]);

  const handleNext = () => {
    // 설정 저장
    localStorage.setItem(CONFIG.STORAGE_KEYS.CONTENT_CATEGORY, category);
    localStorage.setItem(CONFIG.STORAGE_KEYS.IMAGE_STYLE, style);
    localStorage.setItem(CONFIG.STORAGE_KEYS.CHARACTER_TYPE, character.type);
    localStorage.setItem(CONFIG.STORAGE_KEYS.CHARACTER_CONFIG, JSON.stringify(character));
    localStorage.setItem(CONFIG.STORAGE_KEYS.VIDEO_FORMAT, videoFormat);
    onNext();
  };

  return (
    <div className="flex h-full">
      {/* 좌측: 설정 패널 */}
      <div className="w-1/2 max-w-xl p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">영상 설정</h1>

        <div className="space-y-6">
          {/* 이미지 생성 모델 */}
          <ModelSelector selected={imageModel} onSelect={setImageModel} />

          {/* 영상 비율 */}
          <VideoFormatSelector selected={videoFormat} onSelect={setVideoFormat} />

          {/* 콘텐츠 카테고리 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              콘텐츠 카테고리
            </label>
            <CategorySelector selected={category} onSelect={setCategory} />
          </div>

          {/* 이미지 스타일 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              이미지 스타일
            </label>
            <StyleSelector selected={style} onSelect={setStyle} maxDisplay={8} />
          </div>

          {/* 캐릭터 선택 */}
          <CharacterSelector config={character} onChange={setCharacter} />
        </div>

        {/* 다음 단계 버튼 */}
        <button
          onClick={handleNext}
          className="w-full mt-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          다음 단계 →
        </button>
      </div>

      {/* 우측: 미리보기 패널 */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#0A0A0A]">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-4xl">📷</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Create</h3>
          <p className="text-gray-400">
            프롬프트를 입력한 후 Generate 버튼을 클릭하면 AI가 이미지를 생성합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1Settings;
