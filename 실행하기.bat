@echo off
chcp 65001 >nul
title 템플릿 실행기
cd /d "%~dp0"

echo ==========================================
echo   스튜디오 템플릿 설치 및 실행
echo ==========================================
echo.

rem ---------- 1. Node.js 확인 ----------
where node >nul 2>nul
if errorlevel 1 goto INSTALL_NODE

for /f "tokens=1 delims=." %%v in ('node -v') do set "NODEMAJOR=%%v"
set "NODEMAJOR=%NODEMAJOR:v=%"
if %NODEMAJOR% LSS 20 goto INSTALL_NODE
goto NODE_OK

:INSTALL_NODE
echo [1/3] Node.js 최신 LTS 버전을 설치합니다. (권한 확인 창이 뜨면 "예"를 눌러 주세요)
winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
if errorlevel 1 (
  echo.
  echo Node.js 자동 설치에 실패했습니다.
  echo https://nodejs.org 에서 "LTS" 버전을 직접 설치한 뒤, 이 파일을 다시 더블클릭해 주세요.
  pause
  exit /b 1
)
set "PATH=C:\Program Files\nodejs;%PATH%"

:NODE_OK
echo [1/3] Node.js 버전:
node -v
echo.

rem ---------- 2. 패키지 설치 ----------
echo [2/3] 패키지를 확인/설치합니다. 처음에는 1~2분, 이후에는 몇 초면 끝나요...
call npm install
if errorlevel 1 (
  echo.
  echo 패키지 설치 중 오류가 났습니다. 위의 빨간 글씨를 복사해서 Claude에게 보내 주세요.
  pause
  exit /b 1
)

:RUN
echo.
echo [3/3] 사이트를 실행합니다. 브라우저가 자동으로 열려요.
echo        (끄려면 이 창을 닫거나 Ctrl + C 를 누르세요)
echo.
call npm run dev
pause
