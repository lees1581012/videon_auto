# CLAUDE.md

ConGen - 콘텐츠 자동 생성 플랫폼 (6단계 위저드 기반 AI 영상 자동화 시스템)

## 프로젝트 개요

**ConGen** - AI 기반 스토리보드 & 영상 자동 생성 플랫폼

주요 기능:
- 6단계 위저드 방식 콘텐츠 생성 (설정 → 대본 → 음성 → 이미지 → 영상 → 완성)
- 콘텐츠 카테고리 시스템 (일반, 경제, 여행, 다크심리학, 역사, 선사시대)
- 이미지 스타일 17가지 (일반, 웹툰, 지브리, 수채화, 시네마틱, 애니메이션 등)
- 이미지 생성 모델 다양화 (Nano Banana, Nano Banana 2, Nano Banana Pro, Z-Image LoRA)
- TTS 엔진 3종 지원 (Gemini TTS 무료, ElevenLabs 고품질, Edge TTS)
- 캐릭터 시스템 (없음/수아/커스텀)
- 영상 효과 확장 (트랜지션, 자막 번인, 비네팅, 페이드, 블러, 줌)
- MP4 렌더링 및 SRT 자막 내보내기

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (포트 5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 미리보기
npm run preview
```

## 환경 변수 설정

`.env.local` 파일에 API 키 설정:
```
GEMINI_API_KEY=your_gemini_api_key
FAL_API_KEY=your_fal_api_key           # PixVerse 영상 변환용
ELEVENLABS_API_KEY=your_elevenlabs_key  # TTS용 (선택)
```

또는 앱 내 [⚙️ 설정] 메뉴에서 API 키 입력 가능 (localStorage 저장)

## 기술 스택

- **프레임워크**: React 19 + TypeScript + Vite 6
- **UI**: TailwindCSS (어두운 테마, 주황색 포인트 #F97316)
- **AI 서비스**:
  - Google Gemini API (`@google/genai`) - 스크립트, 이미지, TTS
  - fal.ai - PixVerse 영상 변환
  - ElevenLabs - 고품질 TTS + 자막 싱크
  - Edge TTS (Python 서버) - 무료 한국어 TTS

## 6단계 워크플로우

```
1단계: 영상 설정 (Step1Settings)
   - 이미지 생성 모델 선택
   - 영상 비율 선택 (16:9, 1:1, 3:4, 9:16)
   - 콘텐츠 카테고리 선택 (6개)
   - 이미지 스타일 선택 (17가지)
   - 캐릭터 선택 (없음/수아/커스텀)

2단계: 대본 생성 (Step2Script)
   - 프로젝트명 입력
   - 대본 입력
   - AI 씬 분할 (Gemini API)
   - 씬 편집/삭제/합치기

3단계: 음성 생성 (Step3Voice)
   - TTS 엔진 선택 (Gemini 무료 / ElevenLabs 추천)
   - 음성 선택
   - 미리듣기
   - 음성 생성

4단계: 이미지 생성 (Step4Image)
   - 씬별 이미지 자동 생성
   - 개별 재생성
   - 이미지 업로드

5단계: 영상 효과 (Step5VideoCompose)
   - 트랜지션 설정
   - 자막 번인, 비네팅, 페이드, 블러
   - 서서히 확대 설정
   - 영상 생성 시작

6단계: 완성 (Step6Complete)
   - 영상 미리보기
   - MP4 다운로드
   - SRT 자막 내보내기
   - 새 프로젝트 시작
```

## 파일 구조

```
src/
├── App.tsx                    # 기존 앱 (레거시 호환용)
├── ConGenApp.tsx             # 새로운 ConGen 6단계 앱
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx       # 좌측 사이드바
│   │   ├── StepIndicator.tsx # 상단 6단계 진행 바
│   │   └── PageLayout.tsx    # 전체 레이아웃
│   ├── Steps/
│   │   ├── Step1Settings.tsx   # 1단계: 영상 설정
│   │   ├── Step2Script.tsx     # 2단계: 대본 생성
│   │   ├── Step3Voice.tsx      # 3단계: 음성 생성
│   │   ├── Step4Image.tsx      # 4단계: 이미지 생성
│   │   ├── Step5VideoCompose.tsx # 5단계: 영상 효과
│   │   └── Step6Complete.tsx   # 6단계: 완성
│   ├── Settings/
│   │   └── ApiKeyManager.tsx  # API 키 관리
│   ├── Common/
│   │   ├── CategorySelector.tsx  # 카테고리 선택 (6개)
│   │   ├── StyleSelector.tsx     # 이미지 스타일 선택 (17개)
│   │   ├── ModelSelector.tsx     # 이미지 모델 선택
│   │   ├── CharacterSelector.tsx # 캐릭터 선택
│   │   └── VideoFormatSelector.tsx # 영상 비율 선택
│   ├── Header.tsx               # 헤더
│   ├── InputSection.tsx        # 기존 입력 컴포넌트
│   ├── ResultTable.tsx         # 기존 결과 테이블
│   └── ProjectGallery.tsx      # 프로젝트 갤러리
├── services/
│   ├── geminiService.ts        # Gemini API 통합
│   ├── geminiTtsService.ts     # Gemini TTS 전용
│   ├── imageService.ts         # 이미지 생성 라우터
│   ├── elevenLabsService.ts    # ElevenLabs TTS
│   ├── edgeTtsService.ts       # Edge TTS 로컬 서버 연동
│   ├── falService.ts           # fal.ai 통합
│   ├── videoService.ts         # MP4 렌더링
│   ├── projectService.ts       # 프로젝트 저장/불러오기
│   ├── srtService.ts           # SRT 자막 생성
│   ├── prompts.ts              # V10.0 프롬프트 엔진
│   └── exportService.ts        # 엑셀/ZIP 내보내기
├── config.ts                   # 전역 설정
├── types.ts                    # 타입 정의
└── utils/
    └── csvHelper.ts           # CSV/ZIP 내보내기
```

## 핵심 타입

- **AppStep**: 6단계 스텝 (SETTINGS=1, SCRIPT=2, VOICE=3, IMAGE=4, VIDEO_COMPOSE=5, COMPLETE=6)
- **ContentCategory**: 콘텐츠 카테고리 ('general', 'economy', 'travel', 'dark_psychology', 'history', 'prehistoric')
- **ImageStyleId**: 이미지 스타일 (17가지: 'default', 'webtoon', 'ghibli' 등)
- **ImageModelId**: 이미지 모델 ('nano-banana', 'nano-banana-2', 'nano-banana-pro', 'z-image-lora', 'gemini-2.5-flash-image')
- **CharacterType**: 캐릭터 타입 ('none', 'sua', 'custom')
- **TtsEngine**: TTS 엔진 ('gemini', 'elevenlabs', 'edge')
- **VideoEffectSettings**: 영상 효과 설정

## 전역 설정 (config.ts)

### CONTENT_CATEGORIES (6개)
- general: 일반
- economy: 경제 (주식/금융/부동산, 상승=빨강, 하락=파랑)
- travel: 여행 (랜드마크/풍경)
- dark_psychology: 다크심리학 (심리조종/관계)
- history: 역사 (전쟁/왕조/인물)
- prehistoric: 선사시대 (공룡/진화/화석)

### IMAGE_STYLES (17가지)
- default, webtoon, ghibli, watercolor, cinematic, animation, minimal, 3d_cartoon
- pixel_art, vintage, sketch, realistic, chibi, storybook, editorial
- emotional_animation, infographic

### IMAGE_MODELS
- nano-banana: 빠른 생성 (무료)
- nano-banana-2: 가성비 최고 · 고품질 (무료, 추천)
- nano-banana-pro: 프로급 품질 (유료)
- z-image-lora: 50steps 저렴한 가격 (fal.ai)
- gemini-2.5-flash-image: 기존 Gemini (호환용)

### GEMINI_TTS_VOICES (30개)
- Kore, Zephyr, Puck, Charon, Fenrir, Leda, Orus, Aoede, 등...

### TTS 엔진 비교
| 엔진 | 가격 | 자막 싱크 | 장점 |
|------|------|-----------|------|
| Gemini TTS | 무료 | 지원 안함 | 완전 무료 |
| Edge TTS | 무료 | 지원 안함 | 로컬 서버 필요 |
| ElevenLabs | 유료 | 지원 | 고품질, 추천 |

### DEFAULT_VIDEO_EFFECTS
- transition: 'none'
- subtitleBurnIn: true
- vignetting: false
- fadeInOut: false
- blurIntro: false
- slowZoom: 105 (5% 서서히 확대)

## UI 테마

- 배경: #0F0F0F (메인), #1A1A1A (카드), #0A0A0A (사이드바)
- 포인트: #F97316 (주황)
- 텍스트: #FFFFFF (제목), #D1D5DB (본문), #6B7280 (부가 설명)
- 둥근 모서리: rounded-xl (12px) 또는 rounded-2xl (16px)

## Edge TTS 서버 설정 (선택사항)

무료 한국어 TTS를 사용하려면 별도 터미널에서 Python 서버 실행:

```bash
# Python 패키지 설치
pip install edge-tts fastapi uvicorn

# TTS 서버 실행
python tts-server.py
```

서버는 http://localhost:5555에서 실행됨

## 주요 서비스 함수

### 이미지 생성
```typescript
import { generateImage, getSelectedImageModel, getSelectedImageStyle } from './services/imageService';

const imageData = await generateImage(scene, referenceImages, aspectRatio);
```

### 음성 생성
```typescript
// Gemini TTS
import { generateAudioWithGeminiTts, createGeminiTtsSubtitles } from './services/geminiTtsService';
const result = await generateAudioWithGeminiTts(narration, 'Kore');
const subtitles = await createGeminiTtsSubtitles(narration, result.audioDuration);

// ElevenLabs
import { generateAudioWithElevenLabs } from './services/elevenLabsService';
const result = await generateAudioWithElevenLabs(narration);

// Edge TTS
import { generateAudioWithEdgeTts } from './services/edgeTtsService';
const result = await generateAudioWithEdgeTts(narration, 'ko-KR-SunHiNeural');
```

### 영상 렌더링
```typescript
import { generateVideo } from './services/videoService';
const result = await generateVideo(scenes, audioData, imageData, videoEffects);
```

## API 키 관리

앱 내 [⚙️ 설정] 메뉴 또는 localStorage:
- CONFIG.STORAGE_KEYS.GEMINI_API_KEY
- CONFIG.STORAGE_KEYS.ELEVENLABS_API_KEY_STORED
- CONFIG.STORAGE_KEYS.FAL_API_KEY_STORED

## 마이그레이션 안내

### 기존 App.tsx → ConGenApp.tsx
- 기존 App.tsx는 유지 (레거시 호환성)
- 새로운 ConGenApp.tsx는 6단계 위저드 방식
- main.tsx에서 진입점을 변경하여 사용

### localStorage 키 변경
- 기존: 'tubegen_*' 접두사
- 새로운: 'congen_*' 접두사
- 하위 호환성 유지를 위해 기존 키도 읽기 시도 구현

## 개발 팁

### 빌드 오류: /index.css not found
- 경고이며 무시해도 됨 (빌드는 성공)
- CSS는 index.html에서 인라인으로 처리됨

### 새 컴포넌트 추가 시
1. components/Steps/ 에 새 파일 생성
2. types.ts에 필요한 타입 추가
3. config.ts에 설정 상수 추가
4. ConGenApp.tsx에 스텝 케이스 추가

### 스타일 추가 시
- TailwindCSS 클래스 사용 (기본 제공됨)
- 색상: bg-orange-500 (주황), text-gray-300, bg-gray-800 등
- 라운드: rounded-lg, rounded-xl, rounded-2xl

## 브랜치 정보

- 메인 브랜치: `imagemaker`
- ConGen 작업 브랜치: `congen-refactor`
- 깃허브: https://github.com/lees1581012/videon_auto
