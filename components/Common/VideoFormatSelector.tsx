/**
 * ConGen VideoFormatSelector 컴포넌트
 * 영상 비율 선택 (16:9, 1:1, 3:4, 9:16)
 */

import React from 'react';
import { VIDEO_FORMAT_PRESETS } from '../../config';
import type { VideoFormat } from '../../types';

export interface VideoFormatSelectorProps {
  selected: VideoFormat;
  onSelect: (format: VideoFormat) => void;
}

export const VideoFormatSelector: React.FC<VideoFormatSelectorProps> = ({
  selected,
  onSelect
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        영상 비율
      </label>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(VIDEO_FORMAT_PRESETS).map(([key, format]) => (
          <button
            key={key}
            onClick={() => onSelect(key as VideoFormat)}
            className={`
              p-3 rounded-lg border-2 transition-all text-center
              ${selected === key
                ? 'border-orange-500 bg-orange-500/20'
                : 'border-gray-700 bg-gray-900 hover:border-gray-600'
              }
            `}
          >
            <div className="text-sm font-bold text-white">{format.aspectRatio}</div>
            <div className="text-xs text-gray-400">{format.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoFormatSelector;
