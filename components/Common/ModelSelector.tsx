/**
 * ConGen ModelSelector 컴포넌트
 * 이미지 모델 선택 드롭다운
 */

import React from 'react';
import { IMAGE_MODELS } from '../../config';
import type { ImageModelId } from '../../types';

export interface ModelSelectorProps {
  selected: ImageModelId;
  onSelect: (model: ImageModelId) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selected, onSelect }) => {
  const selectedModel = IMAGE_MODELS.find(m => m.id === selected);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        이미지 생성 모델 <span className="text-red-500">*</span>
      </label>
      <select
        value={selected}
        onChange={(e) => onSelect(e.target.value as ImageModelId)}
        className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-orange-500 focus:outline-none"
      >
        {IMAGE_MODELS.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>

      {/* 선택된 모델 설명 */}
      {selectedModel && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">속도: {selectedModel.speed}</span>
          {selectedModel.recommended && (
            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded">추천</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ModelSelector;
