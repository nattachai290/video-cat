#!/usr/bin/env python3
"""voice.py: make a story's dialogue takes with Piper TTS (runs offline, no cloud account).

Run from a story folder (e.g. stories/02-moon-cat):
    pip install piper-tts
    python3 ../../engine/voice.py            # all lines
    python3 ../../engine/voice.py d03 d09    # only some lines (to redo a take)

Reads scripts/cast.json (who -> voice, length, pitch) and scripts/lines.json (id, who, text).
Writes out/voice/raw/<id>_<who>.wav. Voices download once into ../../out/voice-models/. Needs ffmpeg for pitch.
"""
import json, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path.cwd()
MODELS = Path(__file__).resolve().parent.parent / "out/voice-models"
RAW = ROOT / "out/voice/raw"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"



def model(name):
    lang, who, q = name.split("-")
    onnx = MODELS / f"{name}.onnx"
    for f in (onnx, MODELS / f"{name}.onnx.json"):
        if not f.exists():
            MODELS.mkdir(parents=True, exist_ok=True)
            url = f"{HF}/{lang[:2]}/{lang}/{who}/{q}/{f.name}"
            print("download", url)
            urllib.request.urlretrieve(url, f)
    return onnx


def main():
    cast = json.loads((ROOT / "scripts/cast.json").read_text())
    lines = json.loads((ROOT / "scripts/lines.json").read_text())
    only = set(sys.argv[1:])
    RAW.mkdir(parents=True, exist_ok=True)
    for ln in lines:
        if only and ln["id"] not in only:
            continue
        c = cast[ln["who"]]
        out = RAW / f"{ln['id']}_{ln['who']}.wav"
        tmp = out.with_suffix(".tmp.wav")
        subprocess.run([sys.executable, "-m", "piper", "-m", str(model(c["voice"])), "-f", str(tmp),
                        "--length-scale", str(c.get("length", 1.0))], input=ln["text"].encode(), check=True)
        if c.get("pitch", 1.0) != 1.0:
            # shift the pitch without changing the speed: resample down, then stretch back to the original length
            sr = 22050
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(tmp), "-af",
                            f"asetrate={sr * c['pitch']:.0f},aresample={sr},atempo={1 / c['pitch']:.4f}", str(out)], check=True)
            tmp.unlink()
        else:
            tmp.replace(out)
        print(f"{ln['id']} {ln['who']:5s} {ln['text']}")


if __name__ == "__main__":
    main()
