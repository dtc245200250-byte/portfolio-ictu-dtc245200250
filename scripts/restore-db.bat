@echo off
setlocal
echo ============================================================
echo PHUC HOI CO SO DU LIEU MYSQL 8 - DE TAI 13
echo Sinh vien: Phan Quang Tung - MSSV: DTC245200250
echo ============================================================

if "%~1"=="" (
    echo [HUONG DAN] Vui long truyen duong dan file backup .sql:
    echo Vi du: .\scripts\restore-db.bat .\database\backups\portfolio_db_backup_20261023.sql
    exit /b 1
)

set BACKUP_FILE=%~1
if not exist "%BACKUP_FILE%" (
    echo [LOI] File sao luu khong ton tai: %BACKUP_FILE%
    exit /b 1
)

echo Dang phuc hoi tu file: %BACKUP_FILE%...
docker exec -i portfolio_mysql mysql -u portfolio_user -pPortfolioSecurePass2026! portfolio_db < "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [THANH CONG] Da phuc hoi co so du lieu thanh cong!
) else (
    echo [THAT BAI] Loi trong qua trinh phuc hoi co so du lieu.
)
endlocal
