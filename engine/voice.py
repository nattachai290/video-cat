#!/usr/bin/env python3
"""voice.py: make a story's dialogue takes, with emotion.

Run from a story folder (e.g. stories/02-moon-cat):
    python3 ../../engine/voice.py                       # Chatterbox if installed (emotional), else Piper
    python3 ../../engine/voice.py --engine piper        # force Piper (fast, flat)
    python3 ../../engine/voice.py d03 d09               # only some lines (to redo a take)
    python3 ../../engine/voice.py --takes 3 d12         # 3 takes of a line -> pick the best, see below

Engines
  piper       pip install piper-tts. Offline, fast, little emotion. Uses each line's speed/pitch to colour it a bit.
  chatterbox  pip install chatterbox-tts (MIT, Resemble AI; CPU works, slow; GPU/Apple MPS much faster).
              Emotional: each line's `exag` (0.25 calm .. 1.0 shouting) and `cfg` (lower = more dramatic pacing).
              Each character's timbre comes from a reference clip that Piper makes once (out/voice/ref/<who>.wav),
              so the cast keeps the voices chosen in cast.json.

scripts/cast.json   who -> {voice (Piper model), length, pitch, chorus (copies layered for a group, e.g. frogs)}
scripts/lines.json  {id, who, t, text, emo (a note for humans), exag, cfg, speed, pitch}
Output: out/voice/raw/<id>_<who>.wav (16-bit). With --takes N: out/voice/takes/<id>_<who>_<k>.wav; copy the best one to
out/voice/raw/ by hand. Voices download once into ../../out/voice-models/. Needs ffmpeg.
"""
import argparse, json, subprocess, sys, urllib.request
from pathlib import Path

ROOT = Path.cwd()
MODELS = Path(__file__).resolve().parent.parent / "out/voice-models"
RAW, REF, TAKES = ROOT / "out/voice/raw", ROOT / "out/voice/ref", ROOT / "out/voice/takes"
HF = "https://huggingface.co/rhasspy/piper-voices/resolve/main"
REF_TEXT = ("Well, I never expected to see you here tonight. Look at the sky! "
            "Isn't it strange how quiet the village gets when everyone is asleep?")


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *map(str, args)], check=True)


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


def pitch_af(p):
    """ffmpeg filter that shifts pitch by factor p and keeps the length."""
    return f"aresample=48000,asetrate={48000 * p:.0f},aresample=48000,atempo={1 / p:.4f}"


def piper(text, voice, out, length=1.0, pitch=1.0, noise=0.667, noise_w=0.8):
    tmp = out.with_suffix(".piper.wav")
    subprocess.run([sys.executable, "-m", "piper", "-m", str(model(voice)), "-f", str(tmp), "--length-scale", str(length),
                    "--noise-scale", str(noise), "--noise-w-scale", str(noise_w)], input=text.encode(), check=True)
    ff("-i", tmp, "-af", pitch_af(pitch), "-c:a", "pcm_s16le", out)
    tmp.unlink()


def chorus(path, n):
    """Layer n slightly detuned, slightly late copies (a group speaking together)."""
    if n <= 1:
        return
    tmp = path.with_suffix(".solo.wav")
    path.replace(tmp)
    parts = [f"[0]{pitch_af(1 + d)},adelay={ms}:all=1[c{k}]"
             for k, (d, ms) in enumerate([(0, 0), (.06, 35), (-.05, 70), (.11, 20), (-.09, 55)][:n])]
    ff("-i", tmp, "-filter_complex", ";".join(parts) + ";" + "".join(f"[c{k}]" for k in range(n))
       + f"amix=inputs={n}:normalize=1,volume={n ** .5:.2f}", "-c:a", "pcm_s16le", path)
    tmp.unlink()


class Chatterbox:
    def __init__(self):
        import torch
        from chatterbox.tts import ChatterboxTTS
        self.torch = torch
        dev = "cuda" if torch.cuda.is_available() else "mps" if torch.backends.mps.is_available() else "cpu"
        print("chatterbox on", dev)
        self.tts = ChatterboxTTS.from_pretrained(device=dev)

    def say(self, text, ref, out, exag, cfg, temp=0.8):
        import torchaudio
        wav = self.tts.generate(text, audio_prompt_path=str(ref), exaggeration=exag, cfg_weight=cfg, temperature=temp)
        tmp = out.with_suffix(".cb.wav")
        torchaudio.save(str(tmp), wav.cpu(), self.tts.sr)
        ff("-i", tmp, "-ar", "48000", "-c:a", "pcm_s16le", out)
        tmp.unlink()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--engine", choices=["auto", "piper", "chatterbox"], default="auto")
    ap.add_argument("--takes", type=int, default=1)
    a = ap.parse_args()

    cast = json.loads((ROOT / "scripts/cast.json").read_text())
    lines = [l for l in json.loads((ROOT / "scripts/lines.json").read_text()) if not a.ids or l["id"] in a.ids]
    eng = a.engine
    if eng == "auto":
        try:
            import chatterbox  # noqa: F401
            eng = "chatterbox"
        except ImportError:
            eng = "piper"
            print("chatterbox not installed: using piper (pip install chatterbox-tts for emotional voices)")
    cb = Chatterbox() if eng == "chatterbox" else None

    RAW.mkdir(parents=True, exist_ok=True)
    for ln in lines:
        c = cast[ln["who"]]
        for k in range(a.takes):
            out = RAW / f"{ln['id']}_{ln['who']}.wav" if a.takes == 1 else TAKES / f"{ln['id']}_{ln['who']}_{k + 1}.wav"
            out.parent.mkdir(parents=True, exist_ok=True)
            if cb:
                ref = REF / f"{ln['who']}.wav"
                if not ref.exists():                        # the character's timbre, made once with Piper
                    REF.mkdir(parents=True, exist_ok=True)
                    piper(REF_TEXT, c["voice"], ref, c.get("length", 1.0), c.get("pitch", 1.0))
                cb.say(ln["text"], ref, out, ln.get("exag", .5), ln.get("cfg", .5), temp=.8 + .05 * k)
            else:
                # Piper has no emotion control: colour the line with speed, pitch and a looser delivery when excited
                e = ln.get("exag", .5)
                piper(ln["text"], c["voice"], out, c.get("length", 1.0) * ln.get("speed", 1.0),
                      c.get("pitch", 1.0) * ln.get("pitch", 1.0), noise=.5 + .5 * e, noise_w=.6 + .6 * e)
            chorus(out, c.get("chorus", 1))
            print(f"{ln['id']} {ln['who']:8s} [{ln.get('emo', '')}] {ln['text']}" + (f"  (take {k + 1})" if a.takes > 1 else ""))


if __name__ == "__main__":
    main()
