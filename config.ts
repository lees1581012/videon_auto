
/**
 * AutoGen AI 전역 설정 파일
 * 보안을 위해 민감한 API 키는 이곳에 직접 입력하지 마세요.
 * 앱 내의 [설정] 메뉴를 통해 입력하면 브라우저에 안전하게 보관됩니다.
 */

// ===== TTS 엔진 선택 =====
// TTS 엔진 선택
export type TtsEngine = 'elevenlabs' | 'edge' | 'gemini';

// ===== 영상 포맷 타입 및 프리셋 =====

// 영상 포맷 타입
export type VideoFormat = 'landscape' | 'portrait';

// 포맷별 설정
export const VIDEO_FORMAT_PRESETS = {
  landscape: {
    label: '가로 16:9 (유튜브)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9' as const,
    subtitleFontSize: 40,
    subtitleBottomMargin: 80,
    maxScenes: 100,        // 사실상 제한 없음
    targetDurationSec: 0,  // 제한 없음
    bitrate: 12_000_000,
  },
  portrait: {
    label: '세로 9:16 (숏폼)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16' as const,
    subtitleFontSize: 56,
    subtitleBottomMargin: 200,
    maxScenes: 8,
    targetDurationSec: 60,  // 최대 60초 목표
    bitrate: 15_000_000,
  },
} as const;

// ===== 이미지 생성 모델 목록 =====

// 이미지 생성 모델 목록 (Gemini만 지원)
export const IMAGE_MODELS = [
  {
    id: 'gemini-2.5-flash-image',
    name: 'Gemini 2.5 Flash',
    provider: 'Google',
    pricePerImage: 0.0315,  // $0.0315/image (추정)
    description: '고품질, 프롬프트 이해력 우수',
    speed: '보통'
  },
] as const;

export type ImageModelId = typeof IMAGE_MODELS[number]['id'];

// Gemini 전용 스타일 카테고리 (3가지 핵심 화풍)
export const GEMINI_STYLE_CATEGORIES = [
  {
    id: 'main',
    name: '메인 화풍',
    styles: [
      {
        id: 'gemini-crayon',
        name: '크레용 (기본)',
        prompt: 'Hand-drawn crayon and colored pencil illustration style, waxy texture with rough organic strokes, warm nostalgic colors, childlike charm with innocent atmosphere, visible pencil texture on outlines and fills, soft analog warmth, 2D flat composition'
      },
      {
        id: 'gemini-korea-cartoon',
        name: '한국 경제 카툰',
        prompt: 'Korean economic cartoon style, digital illustration with clean bold black outlines, cel-shaded flat coloring, simple rounded stick figure character (white circle head, dot eyes), strong color contrasts with golden warm highlights vs cool gray tones, Korean text integration, modern webtoon infographic aesthetic, professional news graphic feel, dramatic lighting with sparkles and glow effects, 16:9 cinematic composition'
      },
      {
        id: 'gemini-watercolor',
        name: '수채화',
        prompt: 'Soft watercolor illustration style, gentle hand-drawn aesthetic, warm color palette by default, simple stick figure with white circle head and thin black line body, organic brush strokes with paint bleeding effects, soft diffused edges, analog texture. Use cool tones only when danger or twist elements appear. Focus on visualizing the exact meaning and context of the sentence.'
      },
    ]
  }
] as const;

export type GeminiStyleId = typeof GEMINI_STYLE_CATEGORIES[number]['styles'][number]['id'] | 'gemini-custom' | 'gemini-none';

// 가격 정보 (USD)
export const PRICING = {
  // 환율 (USD → KRW)
  USD_TO_KRW: 1450,

  // 이미지 생성 (Gemini만 지원)
  IMAGE: {
    'gemini-2.5-flash-image': 0.0315,  // $0.0315/image
  },
  // TTS (ElevenLabs) - 글자당 가격
  TTS: {
    perCharacter: 0.00003,  // 약 $0.03/1000자 (추정)
  },
  // 영상 생성 (PixVerse)
  VIDEO: {
    perVideo: 0.15,  // $0.15/video (5초)
  }
} as const;

// USD를 KRW로 변환
export function toKRW(usd: number): number {
  return Math.round(usd * PRICING.USD_TO_KRW);
}

// KRW 포맷 (예: 1,234원)
export function formatKRW(usd: number): string {
  const krw = toKRW(usd);
  return krw.toLocaleString('ko-KR') + '원';
}

// ElevenLabs 자막(타임스탬프) 지원 모델 목록
export const ELEVENLABS_MODELS = [
  { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: '다국어 29개, 고품질 (기본값)', supportsTimestamp: true },
  { id: 'eleven_v3', name: 'Eleven v3', description: '최신 모델, 70개 언어, 고표현력', supportsTimestamp: true },
  { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: '빠른 속도, 32개 언어', supportsTimestamp: true },
  { id: 'eleven_flash_v2_5', name: 'Flash v2.5', description: '초고속 ~75ms, 32개 언어', supportsTimestamp: true },
  { id: 'eleven_turbo_v2', name: 'Turbo v2', description: '빠른 속도, 영어 최적화', supportsTimestamp: true },
  { id: 'eleven_monolingual_v1', name: 'Monolingual v1', description: '영어 전용 (레거시)', supportsTimestamp: false },
] as const;

export type ElevenLabsModelId = typeof ELEVENLABS_MODELS[number]['id'];

// ElevenLabs 안정적인 음성 목록 (긴 텍스트에도 에러 없음)
// 미리듣기는 API Key를 사용해 "테스트 목소리입니다" 문구로 생성됨
export const ELEVENLABS_DEFAULT_VOICES = [
  // 여성 음성 (Female) - 안정성 검증된 음성만
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female' as const, accent: 'American', description: '⭐ 가장 안정적, 나레이션 최적화, 긴 텍스트 OK' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female' as const, accent: 'American', description: '부드럽고 친근함, 대화형 콘텐츠에 적합' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female' as const, accent: 'British', description: '세련된 영국식, 고급스러운 나레이션' },
  // 남성 음성 (Male) - 안정성 검증된 음성만
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'male' as const, accent: 'American', description: '⭐ 가장 안정적, 뉴스/다큐 스타일, 긴 텍스트 OK' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male' as const, accent: 'American', description: '젊고 역동적, 유튜브/엔터테인먼트에 적합' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', gender: 'male' as const, accent: 'American', description: '차분하고 신뢰감, 교육/설명 콘텐츠에 적합' },
] as const;

// 기본 음성 타입 정의
export type ElevenLabsDefaultVoice = typeof ELEVENLABS_DEFAULT_VOICES[number];
export type VoiceGender = 'male' | 'female';

export const CONFIG = {
  // 기본 설정값들 (키 제외)
  DEFAULT_VOICE_ID: "21m00Tcm4TlvDq8ikWAM",  // Rachel - 기본 음성 목록에 포함된 유효한 ID
  DEFAULT_ELEVENLABS_MODEL: "eleven_multilingual_v2" as ElevenLabsModelId,
  DEFAULT_IMAGE_MODEL: "gemini-2.5-flash-image" as ImageModelId,
  VIDEO_WIDTH: 1280,
  VIDEO_HEIGHT: 720,

  // 로컬 스토리지 키 이름 (내부 관리용)
  STORAGE_KEYS: {
    ELEVENLABS_API_KEY: 'tubegen_el_key',
    ELEVENLABS_VOICE_ID: 'tubegen_el_voice',
    ELEVENLABS_MODEL: 'tubegen_el_model',
    FAL_API_KEY: 'tubegen_fal_key',  // PixVerse 영상 변환용
    IMAGE_MODEL: 'tubegen_image_model',
    // Gemini 전용 화풍 설정
    GEMINI_STYLE: 'tubegen_gemini_style',
    GEMINI_CUSTOM_STYLE: 'tubegen_gemini_custom_style',
    PROJECTS: 'tubegen_projects',
    TTS_ENGINE: 'tubegen_tts_engine',         // TTS 엔진 선택
    EDGE_TTS_VOICE: 'tubegen_edge_tts_voice', // Edge TTS 음성
  },

  // 애니메이션 설정
  ANIMATION: {
    ENABLED_SCENES: 10,      // 앞 N개 씬을 애니메이션으로 변환
    VIDEO_DURATION: 5        // 생성 영상 길이 (초) - PixVerse v5.5
  }
};
