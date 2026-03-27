/**
 * ConGen CategorySelector 컴포넌트
 * 카테고리 선택 그리드 (6개 카드)
 */

import React from 'react';
import { CONTENT_CATEGORIES } from '../../config';
import type { ContentCategory } from '../../types';

export interface CategorySelectorProps {
  selected: ContentCategory;
  onSelect: (category: ContentCategory) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {CONTENT_CATEGORIES.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`
            p-4 rounded-xl border-2 transition-all text-left
            ${selected === category.id
              ? 'border-orange-500 bg-[#2A1A0A]'
              : 'border-gray-700 bg-gray-900 hover:border-gray-600'
            }
          `}
        >
          <div className="text-2xl mb-2">{category.icon}</div>
          <div className="font-semibold text-white">{category.name}</div>
          <div className="text-sm text-gray-400">{category.subLabel}</div>
        </button>
      ))}
    </div>
  );
};

export default CategorySelector;
