/**
 * ConGen StepIndicator 컴포넌트
 * 상단 6단계 진행 표시 바
 */

import React from 'react';
import { AppStep } from '../../types';

export interface StepIndicatorProps {
  currentStep: AppStep;
  completedSteps: Set<AppStep>;
  onStepClick: (step: AppStep) => void;
}

const STEP_INFO = [
  { step: AppStep.SETTINGS, icon: '⚙️', label: '설정' },
  { step: AppStep.SCRIPT, icon: '📝', label: '대본생성' },
  { step: AppStep.VOICE, icon: '🎤', label: '음성생성' },
  { step: AppStep.IMAGE, icon: '🖼️', label: '이미지생성' },
  { step: AppStep.VIDEO_COMPOSE, icon: '🎬', label: '영상생성' },
  { step: AppStep.COMPLETE, icon: '✅', label: '영상렌더링' },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  completedSteps,
  onStepClick
}) => {
  return (
    <div className="flex items-center justify-center gap-2 py-4 px-6 bg-[#0F0F0F]">
      {STEP_INFO.map((info, index) => {
        const isCompleted = completedSteps.has(info.step);
        const isCurrent = currentStep === info.step;
        const isClickable = isCompleted;

        return (
          <React.Fragment key={info.step}>
            {/* 스텝 버튼 */}
            <button
              onClick={() => isClickable && onStepClick(info.step)}
              disabled={!isClickable}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg transition-all
                ${isCompleted ? 'bg-orange-500/20 text-orange-500 cursor-pointer' : ''}
                ${isCurrent ? 'bg-orange-500 text-white' : ''}
                ${!isCompleted && !isCurrent ? 'bg-gray-800 text-gray-500' : ''}
                ${isClickable ? 'hover:bg-orange-500/30' : 'cursor-not-allowed opacity-50'}
              `}
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">
                {isCompleted ? '✓' : info.icon}
              </span>
              <span className="text-sm font-medium">{info.label}</span>
            </button>

            {/* 화살표 구분자 (마지막 스텝 제외) */}
            {index < STEP_INFO.length - 1 && (
              <span className="text-gray-600">→</span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
