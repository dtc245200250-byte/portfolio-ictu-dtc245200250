@echo off
setlocal
echo ============================================================
echo SAO LUU CO SO DU LIEU MYSQL 8 - DE TAI 13
echo Sinh vien: Phan Quang Tung - MSSV: DTC245200250
echo ============================================================

set BACKUP_DIR=.\database\backups
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,8%_%datetime:~8,6%
set BACKUP_FILE=%BACKUP_DIR%\portfolio_db_backup_%TIMESTAMP%.sql

echo Dang sao luu vao file: %BACKUP_FILE%
docker exec -i portfolio_mysql mysqldump -u portfolio_user -pPortfolioSecurePass2026! portfolio_db > "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo [THANH CONG] Da sao luu co so du lieu thanh cong!
) else (
    echo [THAT BAI] Loi trong qua trinh sao luu co so du lieu.
)
endlocal
