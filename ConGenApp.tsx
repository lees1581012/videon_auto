/**
 * ConGen - 콘텐츠 자동 생성 플랫폼
 * 6단계 위저드 기반 영상 자동화 시스템
 */

import React, { useState, useCallback } from 'react';
import { PageLayout } from './components/Layout/PageLayout';
import { StepIndicator } from './components/Layout/StepIndicator';
import { Step1Settings } from './components/Steps/Step1Settings';
import { Step2Script } from './components/Steps/Step2Script';
import { Step3Voice } from './components/Steps/Step3Voice';
import { Step4Image } from './components/Steps/Step4Image';
import { Step5VideoCompose } from './components/Steps/Step5VideoCompose';
import { Step6Complete } from './components/Steps/Step6Complete';
import { ApiKeyManager } from './components/Settings/ApiKeyManager';
import { ConGenProjectGallery } from './components/ConGenProjectGallery';
import { AppStep, ScriptScene, SubtitleData, VideoEffectSettings } from './types';
import { CONFIG } from './config';
import { generateScript } from './services/geminiService';
import { generateAudioWithGeminiTts, createGeminiTtsSubtitles } from './services/geminiTtsService';
import { generateAudioWithElevenLabs } from './services/elevenLabsService';
import { generateAudioWithEdgeTts } from './services/edgeTtsService';
import { generateImage } from './services/imageService';
import { generateVideo } from './services/videoService';
import * as FileSaver from 'file-saver';

const saveAs = (FileSaver as any).saveAs || (FileSaver as any).default || FileSaver;

type ViewMode = 'create' | 'settings' | 'projects' | 'home';

interface AudioData {
  sceneIndex: number;
  audioData: string;
  duration: number;
  subtitles: SubtitleData;
}

interface ImageData {
  sceneIndex: number;
  imageData: string;
}

const ConGenApp: React.FC = () => {
  // 스텝 상태
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.SETTINGS);
  const [completedSteps, setCompletedSteps] = useState<Set<AppStep>>(new Set());

  // 뷰 모드
  const [viewMode, setViewMode] = useState<ViewMode>('create');

  // 각 스텝 데이터
  const [scenes, setScenes] = useState<ScriptScene[]>([]);
  const [audioData, setAudioData] = useState<AudioData[]>([]);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [videoEffects, setVideoEffects] = useState<VideoEffectSettings>(CONFIG.DEFAULT_VIDEO_EFFECTS);

  // 영상 생성 상태
  const [isRendering, setIsRendering] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [finalSubtitles, setFinalSubtitles] = useState<SubtitleData | null>(null);

  // 스텝 네비게이션
  const goToStep = useCallback((step: AppStep) => {
    if (step === currentStep) return;

    // 이전 스텝으로 이동 시 데이터 유지
    setCompletedSteps(prev => {
      const updated = new Set(prev);
      // 이전 스텝까지 완료로 표시
      for (let s = AppStep.SETTINGS; s < step; s++) {
        updated.add(s);
      }
      return updated;
    });
    setCurrentStep(step);
  }, [currentStep]);

  const handleStepComplete = useCallback((step: AppStep) => {
    setCompletedSteps(prev => new Set(prev).add(step));
    setCurrentStep(step + 1);
  }, []);

  // Step 2: 대본 생성 완료
  const handleScriptComplete = useCallback((newScenes: ScriptScene[]) => {
    setScenes(newScenes);
    handleStepComplete(AppStep.SCRIPT);
  }, [handleStepComplete]);

  // Step 3: 음성 생성
  const handleVoiceComplete = useCallback(async (audios: AudioData[]) => {
    setAudioData(audios);
    handleStepComplete(AppStep.VOICE);
  }, [handleStepComplete]);

  // Step 4: 이미지 생성
  const handleImageComplete = useCallback(async (images: ImageData[]) => {
    setImageData(images);
    handleStepComplete(AppStep.IMAGE);
  }, [handleStepComplete]);

  // Step 5: 영상 효과 설정 완료 → 영상 생성 시작
  const handleStartVideoGeneration = useCallback(async (effects: VideoEffectSettings) => {
    setVideoEffects(effects);
    setIsRendering(true);

    try {
      // 영상 데이터 준비
      const scenesWithAssets = scenes.map((scene, index) => {
        const audio = audioData.find(a => a.sceneIndex === index);
        const image = imageData.find(i => i.sceneIndex === index);
        return {
          ...scene,
          audioUrl: audio?.audioData || '',
          duration: audio?.duration || 5,
          imageUrl: image?.imageData || '',
        };
      });

      // 영상 생성 서비스 호출
      const result = await generateVideo(scenesWithAssets, audioData, imageData, effects);

      if (result.videoUrl) {
        setVideoUrl(result.videoUrl);
        if (result.subtitles) {
          setFinalSubtitles(result.subtitles);
        }
      }

      handleStepComplete(AppStep.VIDEO_COMPOSE);
    } catch (error) {
      console.error('영상 생성 실패:', error);
      alert('영상 생성에 실패했습니다: ' + (error as Error).message);
    } finally {
      setIsRendering(false);
    }
  }, [handleStepComplete, scenes, audioData, imageData]);

  // 새 프로젝트 시작
  const handleNewProject = useCallback(() => {
    // 모든 상태 초기화
    setCurrentStep(AppStep.SETTINGS);
    setCompletedSteps(new Set());
    setScenes([]);
    setAudioData([]);
    setImageData([]);
    setVideoUrl(null);
    setFinalSubtitles(null);
  }, []);

  // 메뉴 클릭 핸들러
  const handleMenuClick = useCallback((menu: ViewMode) => {
    setViewMode(menu);
    if (menu === 'create') {
      setCurrentStep(AppStep.SETTINGS);
    }
  }, []);

  // 현재 렌더링할 컴포넌트 결정
  const renderContent = () => {
    if (viewMode === 'settings') {
      return <ApiKeyManager onClose={() => setViewMode('create')} />;
    }

    if (viewMode === 'projects') {
      return <ConGenProjectGallery onClose={() => setViewMode('create')} />;
    }

    // create 또는 home 모드
    switch (currentStep) {
      case AppStep.SETTINGS:
        return <Step1Settings onNext={() => handleStepComplete(AppStep.SETTINGS)} />;
      case AppStep.SCRIPT:
        return (
          <Step2Script
            scenes={scenes}
            onNext={handleScriptComplete}
            onPrev={() => goToStep(AppStep.SETTINGS)}
          />
        );
      case AppStep.VOICE:
        return (
          <Step3Voice
            scenes={scenes}
            onNext={handleVoiceComplete}
            onPrev={() => goToStep(AppStep.SCRIPT)}
          />
        );
      case AppStep.IMAGE:
        return (
          <Step4Image
            scenes={scenes}
            onNext={handleImageComplete}
            onPrev={() => goToStep(AppStep.VOICE)}
          />
        );
      case AppStep.VIDEO_COMPOSE:
        return (
          <Step5VideoCompose
            onStartGeneration={handleStartVideoGeneration}
            onPrev={() => goToStep(AppStep.IMAGE)}
          />
        );
      case AppStep.COMPLETE:
        return (
          <Step6Complete
            videoUrl={videoUrl}
            subtitles={finalSubtitles}
            isRendering={isRendering}
            onNewProject={handleNewProject}
          />
        );
      default:
        return <Step1Settings onNext={() => handleStepComplete(AppStep.SETTINGS)} />;
    }
  };

  return (
    <PageLayout
      sidebar={{
        activeMenu: viewMode === 'create' ? 'create' : viewMode,
        onMenuClick: handleMenuClick
      }}
      stepIndicator={{
        currentStep,
        completedSteps,
        onStepClick: goToStep
      }}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default ConGenApp;
