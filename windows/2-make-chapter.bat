@echo off
chcp 65001 >nul
title Snackatoon: make a chapter
cd /d "%~dp0.."
set ROOT=%CD%
set PY=%ROOT%\.venv\Scripts\python.exe
set PYTHONUTF8=1
if not exist "%PY%" (echo [!] Run 1-setup.bat first. & pause & exit /b 1)
for /f "delims=" %%i in ('npm root -g') do set NODE_PATH=%%i

echo ============================================================
echo  Snackatoon: voices -^> pick takes -^> mix -^> video
echo ============================================================
echo  Get the newest code from GitHub first? (recommended)
choice /c YN /m "  git pull"
if errorlevel 2 goto :nopull
git pull || echo [!] git pull failed, continuing with the files you have.
:nopull

echo.
set /p CH="  Which chapter of The Kingdom Under the Couch? (1, 2, 3 ...): "
if "%CH%"=="1" (set DIR=%ROOT%\long\07-couch-kingdom) else (set DIR=%ROOT%\long\07-couch-kingdom\ch%CH%)
if not exist "%DIR%\scripts\lines.json" (echo [!] Chapter %CH% not found: %DIR% & pause & exit /b 1)
cd /d "%DIR%"

echo.
echo  1 = everything (record ALL voices again: slowest)
echo  2 = only record lines that have no takes yet, then the rest
echo  3 = skip voices (sound + music + video only: after a code change)
choice /c 123 /m "  What to do"
set MODE=%errorlevel%

if "%MODE%"=="3" goto :mix
echo.
echo [1/5] Recording voices (4 takes per line)...
if "%MODE%"=="1" (
  "%PY%" "%ROOT%\engine\voice.py" --takes 4 || goto :fail
) else (
  "%PY%" "%ROOT%\windows\missing_lines.py" > "%TEMP%\snk_todo.txt"
  set /p TODO=<"%TEMP%\snk_todo.txt"
  call :record
)
echo [2/5] Picking the best takes...
"%PY%" -I "%ROOT%\engine\pick_takes.py" || goto :fail
echo.
echo   Listen and compare: %DIR%\out\voice\compare\
echo   A line marked "!! no take" needs re-recording (tell Claude, or run option 2 again).
echo [3/5] Timing + lip-sync + subtitles...
python "%ROOT%\engine\timing.py"
node "%ROOT%\engine\dialog.mjs" || goto :fail

:mix
echo [4/5] Sound effects, music, mix...
node scripts\sfx.mjs || goto :fail
node scripts\music.mjs || goto :fail
node "%ROOT%\engine\audio\mix.mjs" || goto :fail

echo [5/5] Rendering the video (a few minutes)...
node "%ROOT%\engine\flat\render_pw.mjs" --out=out\video.mp4 --audio=out\audio\mix.wav || goto :fail

echo.
echo ============================================================
echo  Done: %DIR%\out\video.mp4
echo ============================================================
start "" "%DIR%\out"
pause
exit /b 0

:record
setlocal enabledelayedexpansion
if "!TODO!"=="" (echo   all lines already have takes.) else ("%PY%" "%ROOT%\engine\voice.py" --takes 4 !TODO! || (endlocal & goto :fail))
endlocal
exit /b 0

:fail
echo.
echo [X] Something failed above. Take a screenshot of this window and send it to Claude.
pause
exit /b 1
