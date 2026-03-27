/**
 * ConGen PageLayout 컴포넌트
 * 전체 레이아웃 (사이드바 + 메인 콘텐츠 + 스텝바)
 */

import React from 'react';
import { Sidebar, SidebarProps } from './Sidebar';
import { StepIndicator, StepIndicatorProps } from './StepIndicator';

export interface PageLayoutProps {
  sidebar: SidebarProps;
  stepIndicator: StepIndicatorProps;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  sidebar,
  stepIndicator,
  children
}) => {
  return (
    <div className="flex h-screen bg-[#0F0F0F] text-white">
      {/* 사이드바 */}
      <Sidebar {...sidebar} />

      {/* 메인 콘텐츠 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 스텝 인디케이터 */}
        <StepIndicator {...stepIndicator} />

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
