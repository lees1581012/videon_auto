/**
 * ConGen StyleSelector 컴포넌트
 * 이미지 스타일 선택 그리드
 */

import React from 'react';
import { IMAGE_STYLES } from '../../config';
import type { ImageStyleId } from '../../types';

export interface StyleSelectorProps {
  selected: ImageStyleId;
  onSelect: (style: ImageStyleId) => void;
  maxDisplay?: number; // 최대 표시 개수 (기본: 전체)
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selected,
  onSelect,
  maxDisplay
}) => {
  const displayStyles = maxDisplay ? IMAGE_STYLES.slice(0, maxDisplay) : IMAGE_STYLES;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {displayStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`
              p-3 rounded-lg border-2 transition-all text-left
              ${selected === style.id
                ? 'border-orange-500'
                : 'border-gray-700 hover:border-gray-600'
              }
            `}
          >
            {/* 프리뷰 색상 바 */}
            <div
              className="h-8 rounded mb-2"
              style={{
                background: `linear-gradient(to right, ${style.previewColors[0]}, ${style.previewColors[1]})`
              }}
            />
            <div className="text-sm font-medium text-white">{style.name}</div>
            <div className="text-xs text-gray-400">{style.subLabel}</div>
          </button>
        ))}
      </div>

      {/* 더 많은 스타일이 있을 때 안내 */}
      {maxDisplay && IMAGE_STYLES.length > maxDisplay && (
        <p className="text-sm text-gray-500 mt-3">
          앞으로도 계속 늘려갈 예정
        </p>
      )}
    </div>
  );
};

export default StyleSelector;
