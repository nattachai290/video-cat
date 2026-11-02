#!/usr/bin/env python3
"""timing.py: check that every spoken line fits its shot.

Run from a story folder after voice.py:
    python3 ../../engine/timing.py

Reads STORYBOARD.md (shot rows "| 03 | 16–23 | ..."), scripts/lines.json (id, who, shot, t) and the takes in
out/voice/raw/. Speech length is measured without the silence Piper adds at the start and end.
For each line it prints: start, speech length, end, the shot's end, and the gap before the next line starts.
Flags: OVER (runs past its shot or into the next line), TIGHT (less than 0.4 s to breathe or react after it).
"""
import json, re, struct, sys, wave
from pathlib import Path

ROOT = Path.cwd()
GAP = 0.4   # time after a line for the listener to react before the next line or cut


def speech_span(path, thresh=0.02):
    """(start, end) in seconds of the part of the take above `thresh` of full scale."""
    with wave.open(str(path)) as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    assert sw == 2, "expects 16-bit wav"
    s = struct.unpack(f"<{n * ch}h", raw)[::ch]
    win = int(sr * 0.01)
    loud = [i for i in range(0, len(s) - win, win) if max(abs(x) for x in s[i:i + win]) > thresh * 32768]
    if not loud:
        return 0.0, 0.0
    return loud[0] / sr, (loud[-1] + win) / sr


def shots():
    out = {}
    for m in re.finditer(r"^\|\s*(\d{2})\s*\|\s*([\d.]+)\s*[–-]\s*([\d.]+)\s*\|", (ROOT / "STORYBOARD.md").read_text(), re.M):
        out[m[1]] = (float(m[2]), float(m[3]))
    return out


def main():
    sh = shots()
    lines = json.loads((ROOT / "scripts/lines.json").read_text())
    rows, bad = [], 0
    for i, ln in enumerate(lines):
        a, b = speech_span(ROOT / f"out/voice/raw/{ln['id']}_{ln['who']}.wav")
        dur = b - a
        end = ln["t"] + dur
        s0, s1 = sh[ln["shot"]]
        nxt = lines[i + 1]["t"] if i + 1 < len(lines) else float("inf")
        room = min(s1, nxt) - end
        flag = "OVER" if room < 0 or ln["t"] < s0 else "TIGHT" if room < GAP else ""
        bad += flag != ""
        rows.append((ln["id"], ln["who"], ln["shot"], ln["t"], dur, end, s1, nxt, room, flag, ln["text"]))
    print(f"{'id':4} {'who':8} {'shot':4} {'start':>6} {'len':>5} {'end':>6} {'shotEnd':>7} {'next':>6} {'room':>5}  flag")
    for r in rows:
        nx = "-" if r[7] == float("inf") else f"{r[7]:.1f}"
        print(f"{r[0]:4} {r[1]:8} {r[2]:4} {r[3]:6.1f} {r[4]:5.2f} {r[5]:6.2f} {r[6]:7.1f} {nx:>6} {r[8]:5.2f}  {r[9]:5}  {r[10]}")
    total = sum(r[4] for r in rows)
    print(f"\n{len(rows)} lines, {total:.1f} s of speech, {bad} flagged")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
