# AutoGen AI V9.2 - 설치 및 실행 가이드

AI 기반 스토리보드 & 영상 자동 생성 시스템

---

## 1. 초기 설치 (최초 1회만)

### 1-1. Node.js 설치

**목적**: JavaScript 실행 환경 (React 앱 구동)

1. [Node.js 공식 사이트](https://nodejs.org/)에서 LTS 버전 다운로드
2. 설치 후 버전 확인: `node --version` (v20 이상 권장)

---

### 1-2. 프로젝트 의존성 설치

**목적**: React, Vite, AI 라이브러리 등 필요한 패키지 다운로드

```bash
npm install
```

**설치되는 주요 패키지**:
- `react` + `react-dom`: UI 프레임워크
- `vite`: 빌드 도구
- `@google/genai`: Gemini API 클라이언트
- `exceljs`, `file-saver`, `jszip`: 엑셀/ZIP 내보내기

---

## 2. TTS 서버 설정 (Edge TTS 사용 시)

### 2-1. Python 설치

**목적**: Edge TTS 서버 실행 (무료 한국어 TTS)

1. [Python 공식 사이트](https://www.python.org/)에서 다운로드
2. 설치 시 "Add Python to PATH" 체크
3. 버전 확인: `python --version` (3.8 이상 필요)

### 2-2. Edge TTS 패키지 설치

**목적**: Microsoft Edge 무료 TTS 엔진

```bash
pip install edge-tts fastapi uvicorn
```

### 2-3. TTS 서버 실행

**목적**: 로컬 TTS 서버 기동 (포트 5555)

```bash
# 프로젝트 폴더에서 실행
python tts-server.py
```

서버 시작 메시지:
```
Edge TTS server: http://localhost:5555
```

**참고**: TTS 서버는 별도 터미널에서 계속 실행해야 합니다.

---

## 3. API 키 설정

### 3-1. 필수 API 키

| 서비스 | 용도 | 필수여부 | 무료 |
|--------|------|----------|------|
| **Gemini API** | 스크립트 생성, 이미지 생성 | ✅ 필수 | ✅ |
| **Edge TTS** | 음성 생성 (한국어) | ✅ 필수 | ✅ |
| **ElevenLabs** | 고급 음성 + 자막 타임스탬프 | ❌ 선택 | ❌ |
| **FAL API** | PixVerse 영상 변환 | ❌ 선택 | ❌ |

### 3-2. Gemini API 키 발급

**목적**: AI 스크립트/이미지 생성 (Google AI Studio)

1. [Google AI Studio](https://ai.studio.google.com/app/apikey) 접속
2. "Create API Key" 클릭
3. `.env.local` 파일에 키 입력:

```env
GEMINI_API_KEY=여기에_키_입력
```

### 3-3. ElevenLabs API 키 (선택)

**목적**: 고급 TTS + 정확한 자막 타임스탬프

1. [ElevenLabs](https://elevenlabs.io/) 가입
2. Settings → API Keys에서 키 발급
3. `.env.local` 또는 앱 내 설정에서 입력:

```env
ELEVENLABS_API_KEY=여기에_키_입력
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Rachel (기본)
```

### 3-4. FAL API 키 (선택)

**목적**: 이미지 → 영상 애니메이션 변환 (PixVerse)

1. [fal.ai](https://fal.ai/) 가입
2. API Keys에서 키 발급
3. 앱 내 설정에서 입력

---

## 4. 앱 실행

### 4-1. 개발 서버 시작

**목적**: 로컬에서 앱 실행 (개발 모드)

```bash
npm run dev
```

시작 후 브라우저에서 접속:
```
http://localhost:5173
```

### 4-2. 프로덕션 빌드 (선택)

**목적**: 배포용 최적화된 파일 생성

```bash
npm run build      # 빌드
npm run preview    # 빌드된 앱 미리보기
```

---

## 5. 실행 순서 요약

### 최초 실행 시

```bash
# 1. 의존성 설치 (최초 1회)
npm install

# 2. Python 패키지 설치 (최초 1회)
pip install edge-tts fastapi uvicorn

# 3. TTS 서버 시작 (별도 터미널)
python tts-server.py

# 4. 앱 실행
npm run dev
```

### 일반 실행 시 (2회부터)

```bash
# 터미널 1: TTS 서버
python tts-server.py

# 터미널 2: 앱
npm run dev
```

---

## 6. API 키 입력 방법

### 방법 A: .env.local 파일 (개발용)

프로젝트 루트의 `.env.local` 파일에 직접 입력:

```env
GEMINI_API_KEY=your_gemini_key
ELEVENLABS_API_KEY=your_elevenlabs_key
FAL_API_KEY=your_fal_key
```

### 방법 B: 앱 내 설정 패널 (권장)

1. 앱 실행 후 우측 상단 **[⚙️ 설정]** 버튼 클릭
2. 각 API 키 입력
3. localStorage에 자동 저장 (브라우저에 보관)

---

## 7. 주의사항

1. **API 키 보안**: `.env.local` 파일을 Git에 커밋하지 마세요 (`.gitignore`에 포함됨)
2. **TTS 서버**: Edge TTS 사용 시 `tts-server.py`가 항상 실행 중이어야 합니다
3. **포트 충돌**: 5555 포트가 사용 중인 경우 `tts-server.py`의 포트를 변경하세요

---

## 8. 문제 해결

### TTS가 작동하지 않음

```bash
# TTS 서버가 실행 중인지 확인
curl http://localhost:5555/api/tts -X POST -H "Content-Type: application/json" -d "{\"text\":\"테스트\",\"voice\":\"ko-KR-SunHiNeural\"}"
```

### npm install 실패

```bash
# 캐시 삭제 후 재시도
rm -rf node_modules package-lock.json
npm install
```

### Vite 포트 충돌

```bash
# 다른 포트 사용
npm run dev -- --port 3000
```
