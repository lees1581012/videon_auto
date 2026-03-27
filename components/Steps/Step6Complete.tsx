/**
 * ConGen Step6Complete 컴포넌트
 * 6단계: 완성 (영상 렌더링 + 다운로드)
 */

import React, { useState, useRef } from 'react';
import type { SubtitleData } from '../../types';

export interface Step6CompleteProps {
  videoUrl: string | null;
  subtitles: SubtitleData | null;
  isRendering: boolean;
  onNewProject: () => void;
}

export const Step6Complete: React.FC<Step6CompleteProps> = ({
  videoUrl,
  subtitles,
  isRendering,
  onNewProject
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleDownloadMp4 = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `congen-video-${Date.now()}.mp4`;
      a.click();
    }
  };

  const handleDownloadSrt = () => {
    if (subtitles) {
      // TODO: SRT 생성 및 다운로드 로직
      console.log('SRT 다운로드');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6">
      {/* 상단: 완료 상태 표시 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          {[1, 2, 3, 4, 5, 6].map((step) => (
            <div
              key={step}
              className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold"
            >
              ✓
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onNewProject}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            ✨ 새로 만들기
          </button>
          <button
            onClick={handleDownloadSrt}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            ↓ SRT 자막
          </button>
          <button
            onClick={handleDownloadMp4}
            disabled={!videoUrl}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
          >
            ↓ MP4 다운로드
          </button>
        </div>
      </div>

      {/* 중앙: 영상 미리보기 */}
      <div className="max-w-4xl mx-auto">
        {isRendering ? (
          <>
            {/* 렌더링 중 상태 */}
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                <p className="text-white text-lg">영상 렌더링 중...</p>
                <p className="text-gray-400 text-sm mt-2">잠시만 기다려주세요</p>
              </div>
            </div>
          </>
        ) : videoUrl ? (
          <>
            {/* 영상 플레이어 */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                src={videoUrl}
                className="w-full h-full"
                onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
                onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                controls
              />
            </div>
          </>
        ) : (
          <>
            {/* 플레이스홀더 */}
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center">
              <p className="text-gray-500">영상 생성 중...</p>
            </div>
          </>
        )}

        {/* 타임라인 */}
        {duration > 0 && (
          <div className="mt-4 flex items-center gap-4">
            <span className="text-sm text-gray-400 w-16">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-sm text-gray-400 w-16 text-right">{formatTime(duration)}</span>
          </div>
        )}

        {/* 완료 메시지 */}
        {videoUrl && !isRendering && (
          <div className="mt-8 text-center">
            <p className="text-2xl font-semibold text-white">✅ 영상이 완성되었습니다!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step6Complete;
