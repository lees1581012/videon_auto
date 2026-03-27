/**
 * ConGen Sidebar 컴포넌트
 * 좌측 아이콘 기반 사이드바
 */

import React from 'react';

export interface SidebarProps {
  activeMenu: 'home' | 'community' | 'create' | 'settings' | 'projects';
  onMenuClick: (menu: 'home' | 'community' | 'create' | 'settings' | 'projects') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onMenuClick }) => {
  const menuItems = [
    { id: 'home' as const, icon: '🏠', label: '홈' },
    { id: 'community' as const, icon: '👥', label: '커뮤니티', disabled: true },
    { id: 'create' as const, icon: '▶️', label: '생성' },
    { id: 'settings' as const, icon: '⚙️', label: '설정' },
    { id: 'projects' as const, icon: '📁', label: '프로젝트' },
  ];

  return (
    <aside className="w-[60px] bg-[#0A0A0A] flex flex-col items-center py-4 gap-2">
      {/* 로고 */}
      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mb-4">
        c
      </div>

      {/* 메뉴 아이템 */}
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => !item.disabled && onMenuClick(item.id)}
          disabled={item.disabled}
          className={`
            w-10 h-10 rounded-lg flex items-center justify-center text-lg transition-colors
            ${activeMenu === item.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}
            ${item.disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
