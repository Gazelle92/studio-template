@echo off
chcp 65001 >nul
title GitHub 업로드
cd /d "%~dp0"

echo ==========================================
echo   GitHub에 올리기
echo ==========================================
echo.

rem ---------- 1. Git 설치 확인 ----------
where git >nul 2>nul
if not errorlevel 1 goto GIT_OK
echo [1/4] Git이 없어서 설치합니다. (권한 확인 창이 뜨면 "예")
winget install -e --id Git.Git --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
  echo Git 설치에 실패했습니다. https://git-scm.com 에서 설치한 뒤 다시 실행해 주세요.
  pause
  exit /b 1
)
set "PATH=C:\Program Files\Git\cmd;%PATH%"

:GIT_OK
rem ---------- 2. 이름/이메일 (커밋 작성자) ----------
set "GE="
for /f "delims=" %%a in ('git config --global user.email 2^>nul') do set "GE=%%a"
if not "%GE%"=="" goto ID_OK
echo [2/4] 커밋에 남길 이름과 이메일을 입력해 주세요. (GitHub 계정 이메일 권장)
set /p GN=이름: 
set /p GE=이메일: 
git config --global user.name "%GN%"
git config --global user.email "%GE%"

:ID_OK
rem ---------- 3. 저장소 주소 ----------
echo.
echo [3/4] github.com/new 에서 저장소를 먼저 만들어 주세요.
echo       (이름 예: studio-template / Private 권장 / README 추가 체크하지 말 것)
echo.
set /p REPO=만든 저장소 주소를 붙여넣고 Enter (예: https://github.com/아이디/studio-template.git): 
if "%REPO%"=="" (
  echo 주소가 비어 있습니다.
  pause
  exit /b 1
)

rem ---------- 4. 커밋 후 업로드 ----------
echo.
echo [4/4] 업로드합니다. GitHub 로그인 창이 뜨면 로그인해 주세요.
if not exist .git git init -b main
git add -A
git commit -m "Studio portfolio template (React + Vite)" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" -m "Claude-Session: https://claude.ai/code/session_016pJ6H7UNpzHdNDpg84FzA6"
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin %REPO%
git push -u origin main
if errorlevel 1 (
  echo.
  echo 업로드 중 오류가 났습니다. 위의 메시지를 복사해서 Claude에게 보내 주세요.
  pause
  exit /b 1
)
echo.
echo 완료! 브라우저에서 저장소 주소를 열어 파일이 올라갔는지 확인해 보세요.
pause
