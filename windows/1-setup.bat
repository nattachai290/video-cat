@echo off
chcp 65001 >nul
title Snackatoon setup (run once)
cd /d "%~dp0.."
echo ============================================================
echo  Snackatoon: one-time setup for Windows + NVIDIA
echo  Installs Python, Node.js, ffmpeg, Git (via winget) and the
echo  voice / render tools. About 5 GB. Takes 10-30 minutes.
echo ============================================================
echo.

where winget >nul 2>nul || (echo [!] winget not found. Update "App Installer" from the Microsoft Store, then run this again. & pause & exit /b 1)

set NEED_RESTART=0
where python >nul 2>nul || (echo Installing Python... & winget install -e --id Python.Python.3.12 --accept-source-agreements --accept-package-agreements & set NEED_RESTART=1)
where node   >nul 2>nul || (echo Installing Node.js... & winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements & set NEED_RESTART=1)
where ffmpeg >nul 2>nul || (echo Installing ffmpeg... & winget install -e --id Gyan.FFmpeg --accept-source-agreements --accept-package-agreements & set NEED_RESTART=1)
where git    >nul 2>nul || (echo Installing Git... & winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements & set NEED_RESTART=1)
if "%NEED_RESTART%"=="1" (
  echo.
  echo [i] New programs were installed. CLOSE this window and double-click 1-setup.bat AGAIN
  echo     so Windows picks them up.
  pause & exit /b 0
)

echo.
echo [1/4] Python virtual environment...
if not exist ".venv\Scripts\python.exe" python -m venv .venv || goto :fail
".venv\Scripts\python.exe" -m pip install --upgrade pip || goto :fail

echo [2/4] PyTorch with CUDA (NVIDIA)...
".venv\Scripts\python.exe" -m pip install torch==2.6.0 torchaudio==2.6.0 --index-url https://download.pytorch.org/whl/cu124 || goto :fail

echo [3/4] Voice tools (Chatterbox, Piper, Whisper)...
".venv\Scripts\python.exe" -m pip install chatterbox-tts piper-tts faster-whisper librosa || goto :fail

echo [4/4] Renderer (Playwright + Chromium)...
call npm install -g playwright || goto :fail
call npx playwright install chromium || goto :fail

echo.
".venv\Scripts\python.exe" -c "import torch, chatterbox, piper, faster_whisper; print('GPU:', torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'NOT FOUND (will use CPU, slow)')"
echo.
echo ============================================================
echo  Setup done. Now double-click 2-make-chapter.bat
echo ============================================================
pause
exit /b 0
:fail
echo.
echo [X] Something failed above. Take a screenshot of this window and send it to Claude.
pause
exit /b 1
