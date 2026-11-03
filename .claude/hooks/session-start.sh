#!/bin/bash
# SessionStart hook (Claude Code cloud sessions only): installs the voice tools the stories need.
#   1. .venv with piper-tts + chatterbox-tts (CPU torch)   -> required; skipped when already installed
#   2. Piper voice models used by any scripts/cast.json    -> best effort (huggingface.co may be blocked)
#   3. Chatterbox model weights in the Hugging Face cache  -> best effort
# Steps 2-3 never fail the session: if huggingface.co is blocked they print a warning and the session starts anyway.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# ---- 1. Python venv (only if this script changed since the last good install)
hashes=.venv/.session-start.sha256
if ! sha256sum --check --status "$hashes" 2>/dev/null; then
  rm -f "$hashes"
  python3 -m venv .venv
  .venv/bin/pip install --quiet --upgrade pip
  .venv/bin/pip install --quiet torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cpu
  .venv/bin/pip install --quiet chatterbox-tts==0.1.7 piper-tts==1.8.0
  sha256sum .claude/hooks/session-start.sh > "$hashes" || rm -f "$hashes"
  echo "session-start: .venv ready (piper-tts, chatterbox-tts)"
fi

# ---- 2. Piper voice models (reference timbres), from every cast.json in the repo
HF=https://huggingface.co/rhasspy/piper-voices/resolve/main
mkdir -p out/voice-models
voices=$(python3 - <<'PY'
import glob, json
names = set()
for p in glob.glob("stories/*/scripts/cast.json") + glob.glob("long/*/scripts/cast.json"):
    try:
        for c in json.load(open(p)).values():
            if isinstance(c, dict) and c.get("voice"): names.add(c["voice"])
    except Exception:
        pass
print(" ".join(sorted(names)))
PY
)
for v in $voices; do
  IFS=- read -r lang who q <<< "$v"
  for f in "$v.onnx" "$v.onnx.json"; do
    [ -s "out/voice-models/$f" ] && continue
    if ! curl -fsSL --max-time 300 -o "out/voice-models/$f.part" "$HF/${lang:0:2}/$lang/$who/$q/$f"; then
      rm -f "out/voice-models/$f.part"
      echo "session-start: WARNING could not download $f (is huggingface.co allowed in the environment's network settings?)" >&2
      continue
    fi
    mv "out/voice-models/$f.part" "out/voice-models/$f"
  done
done

# ---- 3. Chatterbox weights (downloaded once into ~/.cache/huggingface)
if [ ! -d "$HOME/.cache/huggingface/hub/models--ResembleAI--chatterbox/snapshots" ]; then
  if ! timeout 900 .venv/bin/python -c "from chatterbox.tts import ChatterboxTTS; ChatterboxTTS.from_pretrained(device='cpu')" >/dev/null 2>&1; then
    echo "session-start: WARNING could not fetch the Chatterbox weights (huggingface.co blocked?). engine/voice.py will fall back to Piper or fail." >&2
  fi
fi
exit 0
