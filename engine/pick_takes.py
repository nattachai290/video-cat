#!/usr/bin/env python3
"""pick_takes.py: score every take in out/voice/takes for emotion and copy the best one of each line to out/voice/raw.

Run from a story folder, after `voice.py --takes N`:
    ../../.venv/bin/python ../../engine/pick_takes.py            # score, pick, copy
    ../../.venv/bin/python ../../engine/pick_takes.py --dry      # only print the table

What it measures per take (after trimming silence):
  speech   seconds of speech;  pad = leading/trailing silence Chatterbox added (bad: it drags the timing)
  f0       median pitch (Hz);  range = pitch spread p5..p95 (Hz): the "melody" of the line, the main sign of emotion
  loud     average loudness of the voiced part (dB);  gap = longest pause inside the line (s)
How it scores (from the line's `exag` in scripts/lines.json):
  exag >= .6  (excited, scared, smug...): more pitch range and loudness win, relative to the line's other takes
  exag <  .6  (deadpan, calm, tired): a flat line wins (small range), with a clear pause allowed (comic timing)
  every take: minus padding and minus speech much longer than the median take (stretched / mumbled takes)
  words: if faster-whisper is installed (pip install faster-whisper), each take is transcribed and a take whose words
         don't match the line is disqualified (WRONG). Very high exag (~1.0) or ALL CAPS often garbles Chatterbox's words:
         keep exag <= .9 and normal case, and record more takes instead.
Also writes out/voice/compare/<id>.wav: all takes of a line back to back (best first) to listen and overrule.
"""
import argparse, difflib, json, re, shutil, subprocess, sys
from pathlib import Path
import numpy as np, librosa

ROOT = Path.cwd()
TAKES, RAW, CMP = ROOT / "out/voice/takes", ROOT / "out/voice/raw", ROOT / "out/voice/compare"


def measure(path):
    y, sr = librosa.load(path, sr=24000)
    total = len(y) / sr
    yt, idx = librosa.effects.trim(y, top_db=35)
    speech = len(yt) / sr
    f0, _, _ = librosa.pyin(yt, fmin=60, fmax=700, sr=sr, frame_length=1024)
    v = f0[~np.isnan(f0)]
    rng = float(np.percentile(v, 95) - np.percentile(v, 5)) if len(v) > 4 else 0.0
    med = float(np.median(v)) if len(v) else 0.0
    rms = librosa.feature.rms(y=yt, frame_length=1024, hop_length=256)[0]
    loud = float(20 * np.log10(rms[rms > rms.max() * .1].mean() + 1e-9))
    quiet = rms < rms.max() * .06
    gap, run = 0, 0
    for q in quiet:
        run = run + 1 if q else 0
        gap = max(gap, run)
    return dict(total=total, speech=speech, pad=total - speech, f0=med, range=rng, loud=loud, gap=gap * 256 / sr)


_ASR = None
def heard(path):
    """What the take actually says (faster-whisper base.en), or None if it isn't installed."""
    global _ASR
    if _ASR is None:
        try:
            from faster_whisper import WhisperModel
            _ASR = WhisperModel("base.en", device="cpu", compute_type="int8")
        except ImportError:
            _ASR = False
    if not _ASR:
        return None
    y, _ = librosa.load(path, sr=16000)
    segs, _ = _ASR.transcribe(y, beam_size=5)
    return " ".join(s.text.strip() for s in segs)


def norm(s):
    return re.sub(r"[^a-z ]", "", s.lower().replace("-", " ")).split()


def match(text, said):
    return difflib.SequenceMatcher(None, " ".join(norm(text)), " ".join(norm(said))).ratio()


def z(vals):
    a = np.array(vals, float)
    return (a - a.mean()) / (a.std() + 1e-6) if len(a) > 1 else a * 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    lines = json.loads((ROOT / "scripts/lines.json").read_text())
    RAW.mkdir(parents=True, exist_ok=True)
    CMP.mkdir(parents=True, exist_ok=True)
    print(f"{'take':22s} {'speech':>6} {'pad':>5} {'f0':>5} {'range':>6} {'loud':>6} {'gap':>5} {'score':>6}")
    for ln in lines:
        takes = sorted(TAKES.glob(f"{ln['id']}_{ln['who']}_*.wav"))
        if not takes:
            continue
        m = [measure(p) for p in takes]
        for p, x in zip(takes, m):
            x["said"] = heard(p)
            x["ok"] = x["said"] is None or match(ln["text"], x["said"]) >= .85
        sp = np.median([x["speech"] for x in m])
        excited = ln.get("exag", .5) >= .6
        if excited:
            s = z([x["range"] for x in m]) + .7 * z([x["loud"] for x in m])
        else:
            s = -z([x["range"] for x in m]) + .3 * z([min(x["gap"], .8) for x in m])
        s = s - 2.0 * np.array([max(0, x["pad"] - .35) for x in m]) - 1.5 * np.array([max(0, x["speech"] / sp - 1.3) for x in m])
        s = s - 10.0 * np.array([0 if x["ok"] else 1 for x in m])
        order = np.argsort(-s)
        for i in order:
            x = m[i]
            print(f"{takes[i].stem:22s} {x['speech']:6.2f} {x['pad']:5.2f} {x['f0']:5.0f} {x['range']:6.0f} {x['loud']:6.1f} {x['gap']:5.2f} {s[i]:6.2f}"
                  + ("  <- best" if i == order[0] else "") + ("" if x["said"] is None else f'  "{x["said"]}"' + ("" if x["ok"] else "  WRONG")))
        if not any(x["ok"] for x in m):
            print(f"   !! no take of {ln['id']} says the line: record more takes (voice.py --takes 6 {ln['id']}) or lower its exag")
        print(f"   [{ln.get('emo', '')}] {ln['text']}")
        best = takes[order[0]]
        if not a.dry:
            shutil.copy(best, RAW / f"{ln['id']}_{ln['who']}.wav")
        # all takes back to back, best first, .6 s apart: listen and overrule by copying another take to out/voice/raw
        ins = sum([["-i", str(takes[i])] for i in order], [])
        fc = "".join(f"[{k}]apad=pad_dur=0.6[a{k}];" for k in range(len(order))) + "".join(f"[a{k}]" for k in range(len(order))) + f"concat=n={len(order)}:v=0:a=1"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-filter_complex", fc, str(CMP / f"{ln['id']}.wav")], check=True)


if __name__ == "__main__":
    sys.exit(main())
