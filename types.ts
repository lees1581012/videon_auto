// ===== ConGen 6단계 위저드 타입 =====

// 6단계 스텝 정의
export enum AppStep {
  SETTINGS = 1,      // 설정 (카테고리, 이미지모델, 비율, 스타일, 캐릭터)
  SCRIPT = 2,        // 대본생성
  VOICE = 3,         // 음성생성
  IMAGE = 4,         // 이미지생성
  VIDEO_COMPOSE = 5, // 영상생성 (영상 효과 설정 + 조립)
  COMPLETE = 6       // 영상렌더링 (완성 + MP4 다운로드 + SRT)
}

// 콘텐츠 카테고리
export type ContentCategory = 'general' | 'economy' | 'travel' | 'dark_psychology' | 'history' | 'prehistoric';

export interface ContentCategoryInfo {
  id: ContentCategory;
  name: string;           // 한국어 이름
  subLabel: string;       // 부가 설명 (예: 주식/금융/부동산)
  icon: string;           // 아이콘 문자열
  toneDescription: string; // 영상 톤/무드 설명
  sceneComposition: string; // 장면 구성 규칙
  colorPalette: string;   // 색감 팔레트 설명
  moodTransition: string; // 분위기 전환 규칙
}

// 이미지 스타일 (17가지)
export type ImageStyleId = 'default' | 'webtoon' | 'ghibli' | 'watercolor' | 'cinematic' | 'animation' | 'minimal' | '3d_cartoon' | 'pixel_art' | 'vintage' | 'sketch' | 'realistic' | 'chibi' | 'storybook' | 'editorial' | 'emotional_animation' | 'infographic';

export interface ImageStyleInfo {
  id: ImageStyleId;
  name: string;          // 한국어 이름
  subLabel: string;      // 부가 설명
  promptSuffix: string;  // 프롬프트에 추가할 스타일 설명 (영어)
  previewColors: string[]; // 미리보기용 그라데이션 색상 2개
}

// 이미지 생성 모델 (Fal.ai 기반)
export type ImageModelId = 'nano-banana' | 'nano-banana-2' | 'nano-banana-pro' | 'z-image-lora' | 'gemini-2.5-flash-image';

export interface ImageModelInfo {
  id: ImageModelId;
  name: string;
  description: string;
  speed: string;
  pricePerImage: number;  // 크레딧 또는 USD
  recommended?: boolean;
  provider: 'google' | 'fal';
}

// 캐릭터 설정
export type CharacterType = 'none' | 'sua' | 'custom';

export interface CharacterConfig {
  type: CharacterType;
  name?: string;          // 캐릭터 이름 (커스텀일 때)
  description?: string;   // 캐릭터 설명 (커스텀일 때)
  referenceImages: string[]; // 참조 이미지 (최대 4장)
  customStylePrompt?: string; // 커스텀 스타일 지시문
}

// 프리셋 캐릭터 '수아'
export const PRESET_CHARACTER_SUA: CharacterConfig = {
  type: 'sua',
  name: '수아',
  description: '밝고 귀여운 여자 주인공',
  referenceImages: [],
  customStylePrompt: 'A bright and cute Korean female character named Sua with a warm smile, modern casual style'
};

// TTS 엔진 타입
export type TtsEngine = 'gemini' | 'elevenlabs' | 'edge';

// Gemini TTS 음성
export interface GeminiVoice {
  name: string;       // 예: 'Kore'
  style: string;      // 예: 'Firm'
  language: string;   // 예: 'ko'
}

// 영상 효과 설정
export interface VideoEffectSettings {
  transition: 'none' | 'fade' | 'crossfade' | 'slide_left' | 'slide_right';
  subtitleBurnIn: boolean;       // 자막 번인
  vignetting: boolean;           // 비네팅 (화면 가장자리 어둡게)
  fadeInOut: boolean;            // 페이드 인/아웃
  blurIntro: boolean;            // 블러 인트로
  slowZoom: number;              // 서서히 확대 비율 (0=끄기, 105=5%, 110=10%, 115=15%)
}

// ===== 기존 타입 유지 =====

// 참조 이미지 타입 (캐릭터/스타일 분리 + 강도 조절)
export interface ReferenceImages {
  character: string[];      // 캐릭터 참조 이미지 (최대 2장) - 캐릭터 외모/스타일 참조
  style: string[];          // 스타일 참조 이미지 (최대 2장) - 화풍/분위기 참조
  characterStrength: number; // 캐릭터 참조 강도 (0~100, 기본 70)
  styleStrength: number;     // 스타일 참조 강도 (0~100, 기본 70)
}

// 기본 참조 이미지 설정
export const DEFAULT_REFERENCE_IMAGES: ReferenceImages = {
  character: [],
  style: [],
  characterStrength: 70,
  styleStrength: 70
};

export interface SceneAnalysis {
  composition_type: 'MICRO' | 'STANDARD' | 'MACRO';
  composition_explanation: string; // 구도_설명
  camera: {
    view: string;    // 시점
    distance: string; // 거리
    angle: string;    // 각도
  };
  composition_setup: {
    main_element: string; // 주요_요소
    sub_element: string;  // 보조_요소
    character_positioning: string; // 캐릭터_포지셔닝 (위치, 크기%, 역할)
  };
  visual_metaphor: {
    concept: string;     // 핵심개념
    object: string;      // 메타포_오브젝트
    interaction: string; // 캐릭터_상호작용
  };
  metaphor_category: string; // 8대 카테고리
  color_plan: {
    anchor_colors: Record<string, string>; // 캐릭터 고정색
    background_colors: {
      primary: string;   // 주조색
      sub: string;       // 보조톤
      accent: string;    // 강조색
      metaphor: string;  // 메타포색
      bg: string;        // 배경색
    };
    emotion_match: string; // 감정매칭
  };
  detail_level: 'Minimal(1)' | 'Enhanced(2)' | 'Detailed(3)';
  emotional_amplification_technique: string; // 감정_증폭_기법
  differentiation_point: string; // 차별화포인트
  motion_type: '정적' | '동적';
  motion_detail: string; // 동작디테일
}

// 분할된 씬 타입
export interface ScriptScene {
  sceneNumber: number;
  narration: string;
  visualPrompt: string;
  analysis?: SceneAnalysis;
}

// ElevenLabs 타임스탬프 자막 데이터
export interface SubtitleWord {
  word: string;
  start: number;  // 시작 시간 (초)
  end: number;    // 끝 시간 (초)
}

// AI가 분리한 의미 단위 청크 (타이밍 매핑용)
export interface MeaningChunk {
  text: string;       // 청크 텍스트
  startTime: number;  // 시작 시간 (초)
  endTime: number;    // 끝 시간 (초)
}

export interface SubtitleData {
  words: SubtitleWord[];
  fullText: string;
  meaningChunks?: MeaningChunk[];  // AI가 분리한 의미 단위 청크 (타이밍 포함)
}

// 자막 설정 옵션
export interface SubtitleConfig {
  wordsPerLine: number;      // 한 줄당 단어 수 (기본: 5)
  maxLines: number;          // 최대 줄 수 (기본: 2)
  fontSize: number;          // 폰트 크기 (기본: 32)
  fontFamily: string;        // 폰트 (기본: Noto Sans KR)
  bottomMargin: number;      // 하단 여백 (기본: 60)
  backgroundColor: string;   // 배경색 (기본: rgba(0,0,0,0.75))
  textColor: string;         // 텍스트 색상 (기본: #FFFFFF)
}

// 기본 자막 설정
export const DEFAULT_SUBTITLE_CONFIG: SubtitleConfig = {
  wordsPerLine: 5,
  maxLines: 1,
  fontSize: 40,
  fontFamily: '"Noto Sans KR", "Malgun Gothic", sans-serif',
  bottomMargin: 80,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  textColor: '#FFFFFF'
};

// GeneratedAsset - 카테고리/스타일 추가
export interface GeneratedAsset extends ScriptScene {
  imageData: string | null;
  audioData: string | null;
  audioDuration: number | null;  // 실제 오디오 길이 (초) - SRT 싱크용
  subtitleData: SubtitleData | null;  // 자막 타임스탬프 데이터
  videoData: string | null;      // 애니메이션 영상 URL (앞 N개 씬만)
  videoDuration: number | null;  // 영상 길이 (초) - 보통 4~5초 고정
  status: 'pending' | 'generating' | 'completed' | 'error';
  categoryId?: ContentCategory;  // ConGen 추가
  styleId?: ImageStyleId;        // ConGen 추가
}

export enum GenerationStep {
  IDLE = 'IDLE',
  SCRIPTING = 'SCRIPTING',
  ASSETS = 'ASSETS',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

// 비용 추적
export interface CostBreakdown {
  images: number;      // 이미지 생성 비용
  tts: number;         // TTS 비용
  videos: number;      // 영상 생성 비용
  total: number;       // 총 비용
  imageCount: number;  // 생성된 이미지 수
  ttsCharacters: number; // TTS 글자 수
  videoCount: number;  // 생성된 영상 수
}

// 프로젝트 설정 저장용 타입
export interface ProjectSettings {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;

  // 이미지 모델 설정
  imageModel: string;

  // TTS 설정
  elevenLabsVoiceId: string;
  elevenLabsModel: string;
}

// 생성된 콘텐츠 포함 저장 프로젝트
export interface SavedProject {
  id: string;
  name: string;
  createdAt: number;
  topic: string;  // 생성 키워드/주제

  // 설정
  settings: {
    imageModel: string;
    elevenLabsModel: string;
  };

  // 생성된 콘텐츠 (전체 에셋 저장)
  assets: GeneratedAsset[];

  // 썸네일 (첫 번째 이미지 축소)
  thumbnail: string | null;

  // 비용 정보 (선택적 - 이전 버전 호환)
  cost?: CostBreakdown;
  videoFormat?: import('./config').VideoFormat;  // 영상 포맷 (가로/세로)
}
