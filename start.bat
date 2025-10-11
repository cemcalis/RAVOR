@echo off
echo ========================================
echo   AURA E-Ticaret Platformu
echo ========================================
echo.

echo [1/3] Backend baslatiiliyor...
start "AURA Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [2/3] Frontend baslatiiliyor...
start "AURA Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo   Sunucular baslatildi!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Tarayicinizda http://localhost:3000 adresini acin.
echo.
echo Kapatmak icin her iki terminal penceresini kapatin.
echo.
pause
