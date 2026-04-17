@echo off
chcp 65001 >nul
echo ========================================
echo   停止 nginx
echo ========================================
echo.

REM 檢查 nginx 是否運行
tasklist | findstr /i "nginx.exe" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [提示] nginx 未運行
    pause
    exit /b 0
)

echo [執行] 停止 nginx...
nginx -s stop

REM 等待停止
timeout /t 2 /nobreak >nul

REM 檢查是否停止成功
tasklist | findstr /i "nginx.exe" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ✅ nginx 已停止
) else (
    echo.
    echo [警告] nginx 可能未完全停止
    echo 嘗試強制終止...
    taskkill /F /IM nginx.exe >nul 2>&1
    echo ✅ 已強制終止 nginx
)

echo.
pause
