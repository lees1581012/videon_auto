/**
 * ConGen CharacterSelector 컴포넌트
 * 캐릭터 선택 (없음/수아/커스텀)
 */

import React from 'react';
import type { CharacterType, CharacterConfig } from '../../types';
import { PRESET_CHARACTER_SUA } from '../../types';

export interface CharacterSelectorProps {
  config: CharacterConfig;
  onChange: (config: CharacterConfig) => void;
  onImageUpload?: (images: string[]) => void; // 커스텀 이미지 업로드 핸들러
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({
  config,
  onChange,
  onImageUpload
}) => {
  const characterTypes: { type: CharacterType; name: string; description: string }[] = [
    { type: 'none', name: '없음', description: '캐릭터 없음' },
    { type: 'sua', name: '수아', description: '프리셋 캐릭터' },
    { type: 'custom', name: '커스텀', description: '직접 설정' },
  ];

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300">
        캐릭터 선택
      </label>

      {/* 캐릭터 타입 선택 */}
      <div className="grid grid-cols-3 gap-3">
        {characterTypes.map((charType) => (
          <button
            key={charType.type}
            onClick={() => {
              if (charType.type === 'sua') {
                onChange(PRESET_CHARACTER_SUA);
              } else if (charType.type === 'none') {
                onChange({ type: 'none', referenceImages: [] });
              } else {
                onChange({ type: 'custom', referenceImages: [] });
              }
            }}
            className={`
              p-3 rounded-lg border-2 transition-all text-center
              ${config.type === charType.type
                ? 'border-orange-500 bg-[#2A1A0A]'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }
            `}
          >
            <div className="font-medium text-white">{charType.name}</div>
            <div className="text-xs text-gray-400">{charType.description}</div>
          </button>
        ))}
      </div>

      {/* 커스텀 캐릭터 설정 */}
      {config.type === 'custom' && (
        <div className="space-y-3 p-4 bg-gray-800 rounded-lg">
          {/* 캐릭터 이름 입력 */}
          <input
            type="text"
            placeholder="캐릭터 이름"
            value={config.name || ''}
            onChange={(e) => onChange({ ...config, name: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-orange-500 focus:outline-none"
          />

          {/* 캐릭터 설명 입력 */}
          <textarea
            placeholder="캐릭터 설명 (외모, 성격, 스타일 등)"
            value={config.description || ''}
            onChange={(e) => onChange({ ...config, description: e.target.value })}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-orange-500 focus:outline-none resize-none"
            rows={3}
          />

          {/* 참조 이미지 업로드 */}
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-400 mb-2">
              레퍼런스 이미지 (JPG, PNG, WebP 최대 10MB)
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {config.referenceImages.length}/4
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                // 파일 처리는 부모 컴포넌트에서 수행
                if (onImageUpload && files.length > 0) {
                  // TODO: 파일을 base64로 변환하여 전달
                }
              }}
              className="hidden"
              id="custom-character-upload"
            />
            <label
              htmlFor="custom-character-upload"
              className="inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded cursor-pointer transition-colors"
            >
              이미지 선택
            </label>
          </div>

          {/* 업로드된 이미지 미리보기 슬롯 */}
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3].map((slot) => (
              <div
                key={slot}
                className={`aspect-square rounded-lg border-2 ${
                  config.referenceImages[slot]
                    ? 'border-orange-500 bg-gray-700'
                    : 'border-gray-600 bg-gray-800'
                } flex items-center justify-center`}
              >
                {config.referenceImages[slot] ? (
                  <img
                    src={config.referenceImages[slot]}
                    alt={`Reference ${slot + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-600 text-2xl">+</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterSelector;
