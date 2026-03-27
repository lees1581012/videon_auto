/**
 * ConGen ApiKeyManager 컴포넌트
 * API 키 관리 페이지 (Gemini, ElevenLabs, Fal AI)
 */

import React, { useState, useEffect } from 'react';
import { CONFIG } from '../../config';

export interface ApiKeyManagerProps {
  onClose?: () => void;
}

type ApiKeyProvider = 'gemini' | 'elevenlabs' | 'fal';

const API_KEY_INFO = {
  gemini: {
    name: 'Gemini',
    icon: '◆',
    color: 'text-blue-400',
    description: '대본 생성 · TTS',
    storageKey: CONFIG.STORAGE_KEYS.GEMINI_API_KEY
  },
  elevenlabs: {
    name: 'ElevenLabs',
    icon: '∥',
    color: 'text-white',
    description: '고품질 음성',
    storageKey: CONFIG.STORAGE_KEYS.ELEVENLABS_API_KEY_STORED
  },
  fal: {
    name: 'Fal AI',
    icon: '⚡',
    color: 'text-purple-400',
    description: '이미지 생성',
    storageKey: CONFIG.STORAGE_KEYS.FAL_API_KEY_STORED
  }
} as const;

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onClose }) => {
  const [apiKeys, setApiKeys] = useState<Record<ApiKeyProvider, string>>({
    gemini: '',
    elevenlabs: '',
    fal: ''
  });
  const [showKeys, setShowKeys] = useState<Record<ApiKeyProvider, boolean>>({
    gemini: false,
    elevenlabs: false,
    fal: false
  });

  // 저장된 API 키 로드
  useEffect(() => {
    const loadKeys = () => {
      setApiKeys({
        gemini: localStorage.getItem(CONFIG.STORAGE_KEYS.GEMINI_API_KEY) || '',
        elevenlabs: localStorage.getItem(CONFIG.STORAGE_KEYS.ELEVENLABS_API_KEY_STORED) || '',
        fal: localStorage.getItem(CONFIG.STORAGE_KEYS.FAL_API_KEY_STORED) || ''
      });
    };
    loadKeys();
  }, []);

  const handleSaveKey = (provider: ApiKeyProvider, value: string) => {
    localStorage.setItem(API_KEY_INFO[provider].storageKey, value);
    setApiKeys(prev => ({ ...prev, [provider]: value }));
  };

  const handleClearKey = (provider: ApiKeyProvider) => {
    localStorage.removeItem(API_KEY_INFO[provider].storageKey);
    setApiKeys(prev => ({ ...prev, [provider]: '' }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* 헤더 */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">🔒 API 키 관리</h1>
        <p className="text-gray-400">준비물은 딱 세 가지</p>
      </div>

      {/* API 키 카드 */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {(Object.keys(API_KEY_INFO) as ApiKeyProvider[]).map((provider) => {
          const info = API_KEY_INFO[provider];
          const hasKey = !!apiKeys[provider];
          const isShown = showKeys[provider];

          return (
            <div
              key={provider}
              className={`p-6 rounded-xl border-2 transition-all ${
                hasKey ? 'border-green-500/50 bg-green-500/5' : 'border-gray-700 bg-gray-800'
              }`}
            >
              {/* 아이콘 + 이름 */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-3xl ${info.color}`}>{info.icon}</span>
                <div>
                  <h3 className={`font-semibold ${info.color}`}>{info.name}</h3>
                  <p className="text-sm text-gray-400">{info.description}</p>
                </div>
              </div>

              {/* API 키 입력 */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={isShown ? 'text' : 'password'}
                    placeholder="API 키 입력"
                    value={apiKeys[provider]}
                    onChange={(e) => handleSaveKey(provider, e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-500 focus:border-orange-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {isShown ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>

                {/* 상태 표시 */}
                {hasKey && (
                  <div className="flex items-center gap-2 text-green-400 text-sm">
                    <span>✓</span>
                    <span>등록됨</span>
                  </div>
                )}
              </div>

              {/* 삭제 버튼 */}
              {hasKey && (
                <button
                  onClick={() => handleClearKey(provider)}
                  className="w-full mt-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
                >
                  삭제
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 안내 */}
      <div className="text-center">
        <p className="text-orange-400">
          이 세 개만 등록하면 바로 쓸 수 있어요
        </p>
      </div>

      {/* 닫기 버튼 */}
      {onClose && (
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager;
