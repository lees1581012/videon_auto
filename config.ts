/**
 * ConGen - 콘텐츠 자동 생성 플랫폼 전역 설정
 * 6단계 위저드 기반 영상 자동화 시스템
 */

import type { ContentCategoryInfo, ImageStyleInfo, ImageModelInfo, GeminiVoice, VideoEffectSettings } from './types';

// ===== 영상 포맷 타입 및 프리셋 =====

export type VideoFormat = 'landscape' | 'portrait' | 'square' | 'vertical';

export const VIDEO_FORMAT_PRESETS = {
  landscape: {
    label: '16:9 (유튜브)',
    width: 1280,
    height: 720,
    aspectRatio: '16:9' as const,
    subtitleFontSize: 40,
    subtitleBottomMargin: 80,
  },
  square: {
    label: '1:1 (인스타)',
    width: 1080,
    height: 1080,
    aspectRatio: '1:1' as const,
    subtitleFontSize: 36,
    subtitleBottomMargin: 100,
  },
  vertical: {
    label: '3:4 (세로)',
    width: 1080,
    height: 1440,
    aspectRatio: '3:4' as const,
    subtitleFontSize: 40,
    subtitleBottomMargin: 120,
  },
  portrait: {
    label: '9:16 (쇼츠)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16' as const,
    subtitleFontSize: 56,
    subtitleBottomMargin: 200,
  },
} as const;

// ===== 콘텐츠 카테고리 (6개) =====

export const CONTENT_CATEGORIES: ContentCategoryInfo[] = [
  {
    id: 'general',
    name: '일반',
    subLabel: '범용 콘텐츠',
    icon: '+',
    toneDescription: 'Neutral, balanced tone',
    sceneComposition: 'Standard composition',
    colorPalette: 'Natural balanced colors',
    moodTransition: 'Smooth neutral transitions'
  },
  {
    id: 'economy',
    name: '경제',
    subLabel: '주식/금융/부동산',
    icon: '📈',
    toneDescription: 'Professional financial news tone. 상승=빨강, 하락=파랑 (한국 규칙)',
    sceneComposition: '폭락 이야기=어두워지면서 내려다보는 앵글, 상승 이야기=밝아지면서 위로 올라가는 앵글',
    colorPalette: 'Gold/green for positive, dark red/blue for negative',
    moodTransition: 'Bright→Dark for crash, Dark→Bright for recovery'
  },
  {
    id: 'travel',
    name: '여행',
    subLabel: '랜드마크/풍경',
    icon: '🏛️',
    toneDescription: 'Warm, inviting, adventurous',
    sceneComposition: 'Wide panoramic shots, landmark focus',
    colorPalette: 'Warm sunlight, vivid natural colors',
    moodTransition: 'Gradually opening up, revealing beauty'
  },
  {
    id: 'dark_psychology',
    name: '다크심리학',
    subLabel: '심리조종/관계',
    icon: '🧠',
    toneDescription: '전체적으로 약간 불편한 톤에서 시작해서 가스라이팅이나 감정 조종 같은 주제를 다룸. 비유가 나오면 그걸 그림으로 표현',
    sceneComposition: 'Close-up faces, dark corridors, psychological metaphors',
    colorPalette: 'Muted, desaturated, with occasional warm accent',
    moodTransition: 'Uncomfortable→hopeful, dark→light at ending'
  },
  {
    id: 'history',
    name: '역사',
    subLabel: '전쟁/왕조/인물',
    icon: '📖',
    toneDescription: '세계대전이면 차갑고 거친 느낌, 고대 문명이면 따뜻하고 신비로운 느낌. 그 시대에 있을 수 없는 것들을 알아서 필터링',
    sceneComposition: 'Period-accurate compositions, epic wide shots',
    colorPalette: 'Era-appropriate color grading',
    moodTransition: 'Matches historical narrative arc'
  },
  {
    id: 'prehistoric',
    name: '선사시대',
    subLabel: '공룡/진화/화석',
    icon: '🦴',
    toneDescription: 'Awe-inspiring, scientific wonder',
    sceneComposition: 'Grand scale landscapes, creature focus',
    colorPalette: 'Earth tones, volcanic oranges, primordial greens',
    moodTransition: 'Ancient mystery building to revelation'
  }
];

// ===== 이미지 스타일 (17가지) =====

export const IMAGE_STYLES: ImageStyleInfo[] = [
  { id: 'default', name: '일반', subLabel: '크레용', promptSuffix: 'Hand-drawn crayon illustration style', previewColors: ['#8B7355', '#A0522D'] },
  { id: 'webtoon', name: '웹툰', subLabel: '한국 웹툰 선화', promptSuffix: 'Korean webtoon style with clean bold outlines and cel-shading', previewColors: ['#4169E1', '#1E90FF'] },
  { id: 'ghibli', name: '지브리', subLabel: '수채화 애니', promptSuffix: 'Studio Ghibli watercolor anime style with soft lighting', previewColors: ['#2E8B57', '#90EE90'] },
  { id: 'watercolor', name: '수채화', subLabel: '파스텔 수채화', promptSuffix: 'Soft watercolor painting with gentle brush strokes', previewColors: ['#DDA0DD', '#E6E6FA'] },
  { id: 'cinematic', name: '시네마틱', subLabel: '영화 스틸', promptSuffix: 'Cinematic film still photography with dramatic lighting', previewColors: ['#191970', '#483D8B'] },
  { id: 'animation', name: '애니메이션', subLabel: '일본 애니', promptSuffix: 'Japanese anime animation style', previewColors: ['#4169E1', '#87CEEB'] },
  { id: 'minimal', name: '미니멀', subLabel: '매트', promptSuffix: 'Minimalist flat design with matte colors', previewColors: ['#808080', '#A9A9A9'] },
  { id: '3d_cartoon', name: '3D 카툰', subLabel: '픽사형 3D', promptSuffix: '3D Pixar-style cartoon rendering', previewColors: ['#9370DB', '#BA55D3'] },
  { id: 'pixel_art', name: '픽셀아트', subLabel: '레트로 게임', promptSuffix: 'Retro pixel art game style', previewColors: ['#B8860B', '#DAA520'] },
  { id: 'vintage', name: '빈티지', subLabel: '레트로 포스터', promptSuffix: 'Vintage retro poster art style', previewColors: ['#8B4513', '#D2691E'] },
  { id: 'sketch', name: '스케치', subLabel: '연필 스케치', promptSuffix: 'Pencil sketch hand-drawn illustration', previewColors: ['#696969', '#A9A9A9'] },
  { id: 'realistic', name: '실사', subLabel: '사진 같은', promptSuffix: 'Photorealistic high-quality photograph', previewColors: ['#2F4F4F', '#708090'] },
  { id: 'chibi', name: '치비', subLabel: '레트로 게임', promptSuffix: 'Chibi cute deformed anime character style', previewColors: ['#FF69B4', '#FFB6C1'] },
  { id: 'storybook', name: '스토리북', subLabel: '삽화 자막 배경', promptSuffix: 'Children storybook illustration with warm tones', previewColors: ['#F4A460', '#FFDAB9'] },
  { id: 'editorial', name: '에디토리얼', subLabel: '세련/현대', promptSuffix: 'Modern editorial magazine illustration style', previewColors: ['#778899', '#B0C4DE'] },
  { id: 'emotional_animation', name: '감성동화', subLabel: '인물+수작', promptSuffix: 'Emotional animated story style with handcrafted feel', previewColors: ['#BC8F8F', '#F5DEB3'] },
  { id: 'infographic', name: '인포그래픽', subLabel: '자료 강조', promptSuffix: 'Clean infographic data visualization style', previewColors: ['#3CB371', '#98FB98'] }
];

// ===== 이미지 생성 모델 목록 =====

export const IMAGE_MODELS: ImageModelInfo[] = [
  { id: 'nano-banana', name: 'Nano Banana', description: '빠른 생성', speed: '빠름', pricePerImage: 0, provider: 'google' },
  { id: 'nano-banana-2', name: 'Nano Banana 2', description: '가성비 최고 · 고품질', speed: '보통', pricePerImage: 0, recommended: true, provider: 'google' },
  { id: 'nano-banana-pro', name: 'Nano Banana Pro', description: '프로급 품질', speed: '느림', pricePerImage: 0.01, provider: 'google' },
  { id: 'z-image-lora', name: 'Z-Image LoRA', description: '50steps · 저렴한 가격', speed: '보통', pricePerImage: 0.01, provider: 'fal' },
  { id: 'gemini-2.5-flash-image', name: 'Gemini Flash Image', description: '기존 Gemini 이미지 모델', speed: '보통', pricePerImage: 0.0315, provider: 'google' }
];

export type ImageModelId = typeof IMAGE_MODELS[number]['id'];

// ===== Gemini TTS 음성 목록 (30개) =====

export const GEMINI_TTS_VOICES: GeminiVoice[] = [
  { name: 'Kore', style: 'Firm', language: 'ko' },
  { name: 'Zephyr', style: 'Bright', language: 'multi' },
  { name: 'Puck', style: 'Upbeat', language: 'multi' },
  { name: 'Charon', style: 'Informative', language: 'multi' },
  { name: 'Fenrir', style: 'Excitable', language: 'multi' },
  { name: 'Leda', style: 'Youthful', language: 'multi' },
  { name: 'Orus', style: 'Firm', language: 'multi' },
  { name: 'Aoede', style: 'Breezy', language: 'multi' },
  { name: 'Callirrhoe', style: 'Easy-going', language: 'multi' },
  { name: 'Autonoe', style: 'Bright', language: 'multi' },
  { name: 'Enceladus', style: 'Breathy', language: 'multi' },
  { name: 'Iapetus', style: 'Clear', language: 'multi' },
  { name: 'Umbriel', style: 'Easy-going', language: 'multi' },
  { name: 'Algieba', style: 'Smooth', language: 'multi' },
  { name: 'Despina', style: 'Smooth', language: 'multi' },
  { name: 'Erinome', style: 'Clear', language: 'multi' },
  { name: 'Algenib', style: 'Gravelly', language: 'multi' },
  { name: 'Rasalgethi', style: 'Informative', language: 'multi' },
  { name: 'Laomedeia', style: 'Upbeat', language: 'multi' },
  { name: 'Achernar', style: 'Soft', language: 'multi' },
  { name: 'Alnilam', style: 'Firm', language: 'multi' },
  { name: 'Schedar', style: 'Even', language: 'multi' },
  { name: 'Gacrux', style: 'Mature', language: 'multi' },
  { name: 'Pulcherrima', style: 'Forward', language: 'multi' },
  { name: 'Achird', style: 'Friendly', language: 'multi' },
  { name: 'Zubenelgenubi', style: 'Casual', language: 'multi' },
  { name: 'Vindemiatrix', style: 'Gentle', language: 'multi' },
  { name: 'Sadachbia', style: 'Lively', language: 'multi' },
  { name: 'Sadaltager', style: 'Knowledgeable', language: 'multi' },
  { name: 'Sulafat', style: 'Warm', language: 'multi' }
];

// ===== ElevenLabs 모델 목록 (가격 정보 추가) =====

export const ELEVENLABS_MODELS = [
  { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: '다국어 29개, 고품질 (기본값)', supportsTimestamp: true, pricePerChar: 1 },
  { id: 'eleven_v3', name: 'Eleven v3', description: '최신 모델, 70개 언어, 고표현력', supportsTimestamp: true, pricePerChar: 1 },
  { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: '빠른 속도, 32개 언어', supportsTimestamp: true, pricePerChar: 0.5 },
  { id: 'eleven_flash_v2_5', name: 'Flash v2.5', description: '초고속 ~75ms, 32개 언어', supportsTimestamp: true, pricePerChar: 0.5 },
  { id: 'eleven_turbo_v2', name: 'Turbo v2', description: '빠른 속도, 영어 최적화', supportsTimestamp: true, pricePerChar: 0.5 },
  { id: 'eleven_monolingual_v1', name: 'Monolingual v1', description: '영어 전용 (레거시)', supportsTimestamp: false, pricePerChar: 1 }
] as const;

export type ElevenLabsModelId = typeof ELEVENLABS_MODELS[number]['id'];

// ===== ElevenLabs 음성 목록 =====

export const ELEVENLABS_DEFAULT_VOICES = [
  { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'female' as const, accent: 'American', description: '⭐ 가장 안정적, 나레이션 최적화' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'female' as const, accent: 'American', description: '부드럽고 친근함' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'female' as const, accent: 'British', description: '세련된 영국식' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'male' as const, accent: 'American', description: '⭐ 가장 안정적, 뉴스/다큐' },
  { id: 'TxGEqnHWrfWFTfGW9XjX', name: 'Josh', gender: 'male' as const, accent: 'American', description: '젊고 역동적' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', gender: 'male' as const, accent: 'American', description: '차분하고 신뢰감' }
] as const;

export type ElevenLabsDefaultVoice = typeof ELEVENLABS_DEFAULT_VOICES[number];
export type VoiceGender = 'male' | 'female';

// ===== Edge TTS 음성 목록 =====

export const EDGE_TTS_VOICES = [
  { id: 'ko-KR-SunHiNeural', name: '선히 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-InJoonNeural', name: '인준 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-BongJinNeural', name: '봉진 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-GookMinNeural', name: '국민 (한국어 남성)', lang: 'ko' },
  { id: 'ko-KR-JiMinNeural', name: '지민 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-SeoHyeonNeural', name: '서현 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-SoonBokNeural', name: '순복 (한국어 여성)', lang: 'ko' },
  { id: 'ko-KR-YuJinNeural', name: '유진 (한국어 여성)', lang: 'ko' },
  { id: 'en-US-GuyNeural', name: 'Guy (English Male)', lang: 'en' },
  { id: 'en-US-JennyNeural', name: 'Jenny (English Female)', lang: 'en' }
] as const;

export type EdgeTtsVoiceId = typeof EDGE_TTS_VOICES[number]['id'];

// ===== 가격 정보 =====

export const PRICING = {
  USD_TO_KRW: 1450,
  IMAGE: {
    'nano-banana': 0,
    'nano-banana-2': 0,
    'nano-banana-pro': 0.01,
    'z-image-lora': 0.01,
    'gemini-2.5-flash-image': 0.0315
  },
  TTS: {
    elevenlabs: 0.00001,  // 1 cr = 10,000자 (추정)
    gemini: 0,
    edge: 0
  },
  VIDEO: {
    perVideo: 0.15
  }
} as const;

export function toKRW(usd: number): number {
  return Math.round(usd * PRICING.USD_TO_KRW);
}

export function formatKRW(usd: number): string {
  const krw = toKRW(usd);
  return krw.toLocaleString('ko-KR') + '원';
}

// ===== 기본 영상 효과 설정 =====

export const DEFAULT_VIDEO_EFFECTS: VideoEffectSettings = {
  transition: 'none',
  subtitleBurnIn: true,
  vignetting: false,
  fadeInOut: false,
  blurIntro: false,
  slowZoom: 105  // 5% 서서히 확대
};

// ===== 전역 설정 =====

export const CONFIG = {
  DEFAULT_VOICE_ID: "21m00Tcm4TlvDq8ikWAM",
  DEFAULT_ELEVENLABS_MODEL: "eleven_multilingual_v2" as ElevenLabsModelId,
  DEFAULT_IMAGE_MODEL: "nano-banana-2" as ImageModelId,
  DEFAULT_CATEGORY: "general" as const,
  DEFAULT_STYLE: "default" as const,

  STORAGE_KEYS: {
    // ConGen 새 키
    CONTENT_CATEGORY: 'congen_content_category',
    IMAGE_STYLE: 'congen_image_style',
    IMAGE_MODEL: 'congen_image_model',
    VIDEO_FORMAT: 'congen_video_format',
    CHARACTER_TYPE: 'congen_character_type',
    CHARACTER_CONFIG: 'congen_character_config',
    GEMINI_TTS_VOICE: 'congen_gemini_tts_voice',
    TTS_ENGINE: 'congen_tts_engine',
    VIDEO_EFFECTS: 'congen_video_effects',

    // API 키
    GEMINI_API_KEY: 'congen_gemini_api_key',
    ELEVENLABS_API_KEY: 'congen_el_api_key',
    FAL_API_KEY: 'congen_fal_api_key',

    // 프로젝트
    PROJECTS: 'congen_projects',

    // 기존 호환성 (읽기 전용)
    ELEVENLABS_VOICE_ID: 'tubegen_el_voice',
    GEMINI_STYLE: 'tubegen_gemini_style',
    GEMINI_CUSTOM_STYLE: 'tubegen_gemini_custom_style',
  },

  ANIMATION: {
    ENABLED_SCENES: 10,
    VIDEO_DURATION: 5
  }
};
