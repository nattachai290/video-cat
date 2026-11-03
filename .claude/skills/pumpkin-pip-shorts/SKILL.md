---
name: pumpkin-pip-shorts
description: Make a new "Pumpkin & Pip" YouTube Short (or any flat-cartoon short) in this repo, end to end, entirely in code - storyboard, emotional voices, flat-style scenes, synthesized SFX and music, karaoke subtitles, mix, 1080x1920 MP4. Use for requests like "ทำตอนใหม่", "new episode", "ทำ Shorts แมว", "make a short with Pumpkin and Pip", or to revise an existing story in stories/.
---

# Pumpkin & Pip Shorts

This is the method that made `stories/03-cat-flap` (52 s, done). The user approved its process and asked for it to be
reusable. Reply to the user in Thai; write code, comments and dialogue in English.

## What the user wants (decided, don't re-ask)

- **Format:** YouTube Shorts, vertical 1080x1920, 45-60 s, a self-contained gag that **loops** (last frame = first frame).
- **Style:** flat cartoon (solid colours, darker-rim outlines, soft shadow side). Engine: `engine/flat/`. Not watercolour.
- **Cast:** Pumpkin (round orange tabby, red vest one size too small, bean arms) and Pip (tiny grey mouse, big ears,
  green scarf, cracker). Rig: `engine/cast/pumpkin_pip.js`. Same `u` for both keeps them in scale.
- **Voices:** English, characters talk to each other (no narrator), with emotion (Chatterbox). Subtitles in English.
- **Everything original:** no game/film characters or plots, no samples. SFX and music are synthesized.
- **Token thrift:** the user prefers long-running or repetitive jobs to be handed to a cheaper model (Haiku) via
  `RUNBOOK.md` with a copy-paste prompt. Short renders (sheets, a 1-minute MP4) are fine to run directly.
- **Fixes: stills first.** When the user points out a problem (or you change a shot), send still frames of exactly that
  spot (`--sheet` around the times involved, `--w=540`) and wait for their OK before rendering the full video.
- **Branch:** `claude/nice-heisenberg-5vtd6i`. Keep `PROGRESS.md` and the story's `STATUS.md` updated after each step.

## Folder layout

```
engine/            shared: flat/ (core, timeline, render_pw.mjs), cast/ (pumpkin_pip.js, sheet.js), audio/ (synth.mjs,
                   mix.mjs), voice.py, timing.py, dialog.mjs, acting.js, test/drycheck.mjs
stories/NN-name/   STORYBOARD.md, STATUS.md, studio.html, src/ (config.js, props.js, subs.js, dialog.js, scenes/),
                   scripts/ (lines.json, cast.json, sfx.mjs, music.mjs), out/ (ignored, except out/check/*.jpg via -f)
```

New story: copy `stories/03-cat-flap/` (studio.html, src/config.js, src/subs.js, scripts/cast.json) as the template,
then replace STORYBOARD, lines.json, props.js, scenes, sfx.mjs, music.mjs.

## Workflow (each step ends with a check you look at yourself)

1. **Storyboard** (`STORYBOARD.md`, Thai): logline, a 2-second hook, one gag in three beats, props that pay off, a
   shot table (time, line, camera, acting), and how the last frame matches the first. Get the user's OK.
   - **Stage it for 2D before writing scenes.** Decide what each camera sees and keep geography fixed (in 03: front
     shots from the kitchen, side shots of the door edge-on with kitchen LEFT and garden RIGHT). A storyboard that
     needs one character on both sides of a wall is a staging bug: fix it in the storyboard first.
2. **Dialogue** (`scripts/lines.json`: id, who, shot, t, text, emo, exag 0.25-1, cfg, speed, pitch). Then
   `voice.py` → `timing.py` (0 OVER) → `dialog.mjs` (writes `src/dialog.js`: lip-sync + LY for subtitles).
   Chatterbox sometimes pads short lines (e.g. "Big lunch?" came out 1.9 s): move the line or retake (`--takes 3`).
3. **Sets and props** (`src/props.js`): fixed coordinates in a 1080x1920 world, one function per set.
4. **Shots** (`src/scenes/shots.js`): one function per shot, `shots([[t0, fn], ...])`, every frame a pure function of t.
   - Faces: `faces(t, [[t0, 'name', {overrides}], ...])` (18 presets in `CAST_FACES`). Mouths: `who: 'pumpkin'`.
   - Partly hidden characters (stuck in a hole, inside a bucket): draw them inside `clipRects([...], fn)` and draw the
     occluding prop after. Draw separate paws on a frame edge rather than letting the body show beside a hole.
   - Pose ideas: `take()`, `spring()/ring()`, `arcPt()` for flights, `shakeXY()` on impacts, `burst()`, `puffCloud()`,
     `splash()`, `bubbles()`. Transitions: `brushWipe()`, `circleWipe()`, cut on action.
5. **Check, every pass** (from the story folder):
   ```bash
   node ../../engine/test/drycheck.mjs --times=$(python3 -c "print(','.join(str(x/4) for x in range(0,208)))")
   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --sheet=<one time per shot> --cols=6 --w=270 --out=out/check/sheet.jpg
   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --sheet=<every ~0.1 s of an action> --cols=8 --w=180 --out=out/check/motion.jpg
   ```
   Open the images (Read) and look for: anything that doesn't read at phone size, bodies showing where they should be
   hidden, props hidden behind props, characters left in frame at the loop point, faces covered by subtitles.
6. **Sound:** `scripts/sfx.mjs` (cue sheet with `Track.put(t, len, gen, {gain, pan, send})` from `engine/audio/synth.mjs`:
   boing, thud, pop, whoosh, splash, clang, blub, drip, tap, squish, crunch, chomp, inflate, burp, squeak, poof, eep,
   chirp, bed) and `scripts/music.mjs` (sequencer: pluck, marimba, bass, kick, shaker, bongo, snare). Choose the BPM so
   the length is a whole number of bars (03: 24 bars at 110.77 bpm = 52 s) so the music loops with the picture. Leave a
   beat of silence for the biggest gag. Then `node ../../engine/audio/mix.mjs` (-14 LUFS, music ducks under voices).
7. **Subtitles:** `src/subs.js` (karaoke, speaker colours, upper middle at y ≈ 430). Check one frame per line.
8. **Final:**
   ```bash
   NODE_PATH=$(npm root -g) node ../../engine/flat/render_pw.mjs --out=out/video.mp4 --audio=out/audio/mix.wav
   ffmpeg -y -loglevel error -i out/video.mp4 -vf "select='not(mod(n\,48))',scale=180:-1,tile=9x3" -frames:v 1 out/check/cuts.jpg
   ```
   Check ffprobe (1080x1920, audio stream, duration), look at cuts.jpg, send the MP4 with SendUserFile, commit
   (`git add -f out/check/cuts.jpg`), push, update STATUS.md and PROGRESS.md.

## Shorts rules

- **Pacing (user feedback on story 08: "ยืด ไม่สนุก"):** a new gag every 3-4 s, every gag bigger than the last, no shots
  of characters just walking in, cut on action, speed lines / whip pans / shakes, fast music (~138 bpm), 45 s is enough.

- Hook readable in the first 2 s with the sound off. Subtitles carry the dialogue.
- Keep faces and subtitles out of the bottom ~350 px and the right-hand ~150 px (YouTube UI).
- Characters big: at least 40% of frame height in acting shots. One gag, three beats, button at the end.
- Tell the user to tick YouTube's "altered or synthetic content" box (AI voices).

## Gotchas learned

- `render.mjs`/p5.brush is the old watercolour engine (slow without a GPU). The flat engine renders ~50-110 ms/frame;
  a whole 52 s Short takes under a minute with `render_pw.mjs` (Playwright, no npm install on the cloud machine).
- `drycheck.mjs` catches NaN geometry and runtime errors without a browser; run it before every render.
- Top-level `const` in a story file is global to the page: avoid name clashes with the engine (`seg`, `W`, `H`, `T`...).
- Never commit `out/audio` or MP4s (big). A 41 MB WAV once slipped into history; `.gitignore` now covers it.
- Chatterbox on CPU takes ~30 s per line and slows renders while it runs: start it in the background early.
- The user sometimes changes direction (story, style, format). Ask with AskUserQuestion and show options
  (e.g. a 4-style sample sheet, a 4-arm-shape sheet) instead of guessing; small visual samples are cheap here.
