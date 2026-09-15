@echo off
setlocal
title Amanda Pet Sitter - visualizacao local

where py >nul 2>&1
if not errorlevel 1 goto :python_launcher

where python >nul 2>&1
if not errorlevel 1 goto :python_command

echo Python nao foi encontrado.
echo Instale o Python em https://www.python.org/downloads/ e tente novamente.
pause
exit /b 1

:python_launcher
start "Amanda Pet Sitter" cmd /k "cd /d ""%~dp0public"" && py -m http.server 8000"
goto :open_browser

:python_command
start "Amanda Pet Sitter" cmd /k "cd /d ""%~dp0public"" && python -m http.server 8000"

:open_browser
timeout /t 2 /nobreak >nul
start "" "http://localhost:8000/"
echo Site aberto em http://localhost:8000/
echo Feche a janela do servidor quando terminar.
