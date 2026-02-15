@echo off
cd /d "%~dp0"
echo Servidor em http://localhost:8080
echo Abra: http://localhost:8080/cliente/pedido-casa.html
echo.
python -m http.server 8080
