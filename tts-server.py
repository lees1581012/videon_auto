from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import edge_tts
import base64
import tempfile
import os
import re

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


class TTSRequest(BaseModel):
    text: str
    voice: str = "ko-KR-SunHiNeural"


def clean_text(text):
    text = text.replace("'", "").replace("\u2018", "").replace("\u2019", "")
    text = text.replace("`", "")
    text = text.replace('"', '').replace('\u201c', '').replace('\u201d', '')
    text = text.replace("...", ".").replace("\u2026", ".")
    text = re.sub(r'\.{2,}', '.', text)
    text = text.replace("&", " and ").replace("<", "").replace(">", "")
    return text.strip()


@app.post("/api/tts")
async def tts(req: TTSRequest):
    text = clean_text(req.text)
    print(f"[TTS] 요청: voice={req.voice}, text={text[:50]}...")

    tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
    tmp_path = tmp.name
    tmp.close()

    try:
        communicate = edge_tts.Communicate(text, req.voice)
        await communicate.save(tmp_path)

        with open(tmp_path, "rb") as f:
            audio_bytes = f.read()

        if len(audio_bytes) == 0:
            raise Exception("오디오가 비어있습니다")

        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")
        print(f"[TTS] 성공: {len(audio_bytes)} bytes")
        return {"audioData": audio_base64, "format": "mp3"}
    except Exception as e:
        print(f"[TTS] 에러: {e}")
        return {"error": str(e)}
    finally:
        if os.path.exists(tmp_path):
            os.unlink(tmp_path)


if __name__ == "__main__":
    import uvicorn
    print("Edge TTS server: http://localhost:5555")
    uvicorn.run(app, host="0.0.0.0", port=5555)