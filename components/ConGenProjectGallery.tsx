/**
 * ConGen ConGenProjectGallery 컴포넌트
 * ConGen 전용 프로젝트 갤러리
 */

import React, { useState, useEffect } from 'react';
import { getSavedProjects, deleteProject } from '../services/projectService';
import { SavedProject } from '../types';

export interface ConGenProjectGalleryProps {
  onClose: () => void;
}

export const ConGenProjectGallery: React.FC<ConGenProjectGalleryProps> = ({ onClose }) => {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const saved = await getSavedProjects();
      setProjects(saved);
    } catch (error) {
      console.error('프로젝트 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirmDelete === id) {
      await deleteProject(id);
      setConfirmDelete(null);
      loadProjects();
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 h-full flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">프로젝트 갤러리</h1>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          닫기
        </button>
      </div>

      {/* 프로젝트 목록 */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">불러오는 중...</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📁</div>
            <p className="text-gray-400">저장된 프로젝트가 없습니다</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#1A1A1A] rounded-xl p-4 hover:bg-[#252525] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white truncate flex-1">
                  {project.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  className={`ml-2 p-1 rounded transition-colors ${
                    confirmDelete === project.id
                      ? 'bg-red-500/20 text-red-400'
                      : 'text-gray-500 hover:text-red-400'
                  }`}
                  title={confirmDelete === project.id ? '다시 클릭하여 삭제' : '삭제'}
                >
                  🗑️
                </button>
              </div>
              <div className="text-sm text-gray-400 space-y-1">
                <div>씬: {project.scenes?.length || 0}개</div>
                <div>생성일: {formatDate(project.createdAt)}</div>
              </div>
              {project.thumbnail && (
                <div className="mt-3 rounded-lg overflow-hidden aspect-video bg-black">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConGenProjectGallery;
