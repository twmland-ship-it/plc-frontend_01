@echo off
chcp 65001 >nul
echo ========================================
echo   plc-frontend nginx 啟動腳本
echo ========================================
echo.

REM 檢查 nginx 是否已安裝
where nginx >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [錯誤] 找不到 nginx.exe
    echo.
    echo 請先安裝 nginx:
    echo 1. 下載: https://nginx.org/en/download.html
    echo 2. 解壓到 C:\nginx 或其他目錄
    echo 3. 將 nginx 目錄加入 PATH 環境變數
    echo.
    pause
    exit /b 1
)

echo [檢查] nginx 已安裝
echo.

REM 檢查配置檔案
if not exist "%~dp0nginx.conf" (
    echo [錯誤] 找不到 nginx.conf
    echo 請確認 nginx.conf 在當前目錄
    pause
    exit /b 1
)

echo [檢查] 配置檔案存在
echo.

REM 檢查 OCOGUI backend 是否運行
echo [檢查] OCOGUI backend (port 2955)...
netstat -an | findstr ":2955" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [警告] OCOGUI backend 似乎未運行 (port 2955)
    echo 請先啟動 OCOGUI backend
    echo.
    set /p continue="是否繼續啟動 nginx? (Y/N): "
    if /i not "%continue%"=="Y" exit /b 1
) else (
    echo [成功] OCOGUI backend 正在運行
)
echo.

REM 檢查 port 8345 是否被佔用
echo [檢查] port 8345 是否可用...
netstat -an | findstr ":8345" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [警告] port 8345 已被佔用
    echo.
    echo 請先停止佔用 port 8345 的程序
    echo 或修改 nginx.conf 中的 listen 端口
    echo.
    pause
    exit /b 1
)
echo [成功] port 8345 可用
echo.

REM 測試配置檔案
echo [測試] nginx 配置檔案...
nginx -t -c "%~dp0nginx.conf"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [錯誤] nginx 配置檔案有誤
    echo 請檢查 nginx.conf
    pause
    exit /b 1
)
echo.

REM 啟動 nginx
echo [啟動] nginx...
start nginx -c "%~dp0nginx.conf"

REM 等待啟動
timeout /t 2 /nobreak >nul

REM 檢查是否啟動成功
netstat -an | findstr ":8345" | findstr "LISTENING" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ nginx 啟動成功！
    echo ========================================
    echo.
    echo 訪問地址: http://localhost:8345
    echo.
    echo 停止 nginx: nginx -s stop
    echo 重新載入配置: nginx -s reload
    echo.
) else (
    echo.
    echo [錯誤] nginx 啟動失敗
    echo 請檢查錯誤日誌
)

pause
