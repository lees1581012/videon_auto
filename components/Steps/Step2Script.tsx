/**
 * ConGen Step2Script 컴포넌트
 * 2단계: 대본 입력/생성
 */

import React, { useState } from 'react';
import { generateScript } from '../../services/geminiService';
import type { ScriptScene } from '../../types';

export interface Step2ScriptProps {
  onNext: (scenes: ScriptScene[]) => void;
  onPrev: () => void;
}

export const Step2Script: React.FC<Step2ScriptProps> = ({ onNext, onPrev }) => {
  const [projectName, setProjectName] = useState('');
  const [script, setScript] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);
  const [scenes, setScenes] = useState<ScriptScene[]>([]);

  const handleSplitScript = async () => {
    if (!script.trim() && !projectName.trim()) return;

    setIsSplitting(true);
    try {
      let generatedScenes: ScriptScene[];

      // 스크립트가 있으면 문단 분할, 없으면 토픽으로 생성
      if (script.trim()) {
        // 기존 스크립트를 문단 단위로 분할
        const paragraphs = script.split(/\n\n+/).filter(Boolean);
        generatedScenes = paragraphs.map((narration, index) => ({
          sceneNumber: index + 1,
          narration: narration.trim(),
          visualPrompt: '',
        }));
      } else if (projectName.trim()) {
        // 토픽으로 AI 생성
        generatedScenes = await generateScript(projectName, false, null, 'landscape');
      } else {
        return;
      }

      setScenes(generatedScenes);
    } catch (error) {
      console.error('씬 생성 실패:', error);
      alert('스크립트 생성에 실패했습니다. API 키를 확인해주세요.');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleSceneEdit = (sceneNumber: number, newNarration: string) => {
    setScenes(prev => prev.map(scene =>
      scene.sceneNumber === sceneNumber
        ? { ...scene, narration: newNarration }
        : scene
    ));
  };

  const handleSceneDelete = (sceneNumber: number) => {
    setScenes(prev => {
      const filtered = prev.filter(s => s.sceneNumber !== sceneNumber);
      // 재번호 매기기
      return filtered.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
    });
  };

  const handleMergeScenes = (sceneNumber: number) => {
    setScenes(prev => {
      const currentScene = prev.find(s => s.sceneNumber === sceneNumber);
      const nextScene = prev.find(s => s.sceneNumber === sceneNumber + 1);

      if (currentScene && nextScene) {
        const mergedNarration = currentScene.narration + ' ' + nextScene.narration;
        const merged = prev
          .filter(s => s.sceneNumber !== sceneNumber + 1)
          .map(s => s.sceneNumber === sceneNumber ? { ...s, narration: mergedNarration } : s);
        // 재번호 매기기
        return merged.map((s, i) => ({ ...s, sceneNumber: i + 1 }));
      }
      return prev;
    });
  };

  const handleNext = () => {
    if (scenes.length > 0) {
      onNext(scenes);
    }
  };

  return (
    <div className="flex h-full relative">
      {/* 좌측: 대본 입력 영역 */}
      <div className="w-1/2 max-w-xl p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold mb-6">대본을 입력하세요</h1>

        <div className="space-y-4">
          {/* 프로젝트명 */}
          <div>
            <input
              type="text"
              placeholder="비트코인 10만 달러 돌파"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* 대본 입력 */}
          <div>
            <textarea
              placeholder="대본 내용을 직접 입력하거나 붙여넣기"
              value={script}
              onChange={(e) => setScript(e.target.value)}
              className="w-full h-64 p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none resize-none"
            />
            <div className="flex justify-between mt-2 text-sm text-gray-400">
              <span>{script.length}자</span>
              <span>목표: 60초 영상</span>
            </div>
          </div>

          {/* 씬 분할 버튼 */}
          <button
            onClick={handleSplitScript}
            disabled={isSplitting || !script.trim()}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSplitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                분할 중...
              </>
            ) : (
              <>✨ 씬 분할하기</>
            )}
          </button>
        </div>
      </div>

      {/* 우측: 분할된 씬 미리보기 */}
      <div className="flex-1 p-6 overflow-auto">
        {scenes.length > 0 ? (
          <div>
            <h2 className="text-lg font-semibold mb-4">분할된 씬 ({scenes.length}개)</h2>
            <div className="space-y-3">
              {scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-orange-500 mb-1">Scene {scene.sceneNumber}</div>
                      <p className="text-white text-sm">{scene.narration}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSceneEdit(scene.sceneNumber, prompt('나레이션 수정:', scene.narration) || scene.narration)}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded text-white"
                      >
                        편집
                      </button>
                      <button
                        onClick={() => handleMergeScenes(scene.sceneNumber)}
                        disabled={scene.sceneNumber === scenes.length}
                        className="px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded text-white"
                      >
                        합치기
                      </button>
                      <button
                        onClick={() => handleSceneDelete(scene.sceneNumber)}
                        className="px-2 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            <p>씬 분할 후 여기에 표시됩니다</p>
          </div>
        )}
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
          disabled={scenes.length === 0}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          다음 →
        </button>
      </div>
    </div>
  );
};

export default Step2Script;
