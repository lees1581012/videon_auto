/**
 * ConGen Step4Image 컴포넌트
 * 4단계: 이미지 생성
 */

import React, { useState } from 'react';
import type { ScriptScene } from '../../types';

export interface Step4ImageProps {
  scenes: ScriptScene[];
  onNext: (imageData: { sceneIndex: number; imageData: string }[]) => void;
  onPrev: () => void;
}

export const Step4Image: React.FC<Step4ImageProps> = ({ scenes, onNext, onPrev }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ sceneIndex: number; imageData: string }[]>([]);
  const [progress, setProgress] = useState({ completed: 0, failed: 0, pending: scenes.length });

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setProgress({ completed: 0, failed: 0, pending: scenes.length });

    try {
      // TODO: 이미지 생성 로직 구현
      // 임시로 순차적 처리 시뮬레이션
      for (let i = 0; i < scenes.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setProgress(prev => ({
          completed: prev.completed + 1,
          failed: prev.failed,
          pending: prev.pending - 1
        }));
      }

      // 더미 데이터
      const dummyImages = scenes.map((_, index) => ({
        sceneIndex: index,
        imageData: 'dummy_image_data'
      }));
      setGeneratedImages(dummyImages);
    } catch (error) {
      console.error('이미지 생성 실패:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async (sceneIndex: number) => {
    // TODO: 단일 이미지 재생성
  };

  const handleImageUpload = (sceneIndex: number) => {
    // TODO: 이미지 업로드
  };

  const handleNext = () => {
    if (generatedImages.length > 0) {
      onNext(generatedImages);
    }
  };

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">이미지 생성</h1>
        <p className="text-gray-400">각 씬에 맞는 이미지를 자동으로 생성합니다.</p>
      </div>

      {/* 설명 */}
      <div className="text-center mb-6 text-sm text-gray-400">
        씬별 이미지 ({scenes.length}개) — 클릭하여 업로드하거나, 아래 버튼으로 AI 일괄 생성
      </div>

      {/* 씬 카드 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {scenes.map((scene) => {
          const imageData = generatedImages.find(i => i.sceneIndex === scene.sceneNumber - 1);
          const isGenerated = !!imageData;
          const isProcessing = isGenerating && !imageData;

          return (
            <div
              key={scene.sceneNumber}
              onClick={() => !isProcessing && handleImageUpload(scene.sceneNumber - 1)}
              className="relative aspect-video bg-gray-800 rounded-lg border-2 border-gray-700 hover:border-gray-600 cursor-pointer transition-colors overflow-hidden group"
            >
              {/* 재생성 버튼 */}
              {isGenerated && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRegenerate(scene.sceneNumber - 1);
                  }}
                  className="absolute top-2 right-2 z-10 px-2 py-1 bg-gray-900/80 hover:bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  재생성
                </button>
              )}

              {/* 이미지 또는 상태 표시 */}
              {isGenerated ? (
                <div className="w-full h-full flex items-center justify-center bg-green-500/20">
                  <span className="text-green-400 text-lg">✓ 생성 완료</span>
                </div>
              ) : isProcessing ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-600 text-2xl">+</span>
                </div>
              )}

              {/* 하단 레이블 */}
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded text-white text-xs">
                Scene {scene.sceneNumber}
              </div>
            </div>
          );
        })}
      </div>

      {/* 진행바 */}
      {isGenerating && (
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white">생성 중... Nano Banana 2</span>
            <span className="text-gray-400">{progress.completed}/{scenes.length} ({Math.round(progress.completed / scenes.length * 100)}%)</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(progress.completed / scenes.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-4 mt-2 text-xs text-gray-400">
            <span className="text-green-400">성공 {progress.completed}</span>
            <span className="text-red-400">실패 {progress.failed}</span>
            <span>대기 {progress.pending}</span>
          </div>
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          ← 이전
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                생성 중...
              </>
            ) : generatedImages.length > 0 ? (
              <>✓ 생성 완료</>
            ) : (
              <>AI 일괄 생성</>
            )}
          </button>

          <button
            onClick={handleNext}
            disabled={generatedImages.length === 0}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            다음 →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4Image;
