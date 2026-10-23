#!/bin/bash
# Script sao lưu cơ sở dữ liệu MySQL 8 từ Docker container
# Sinh viên: Phan Quang Tùng - MSSV: DTC245200250

BACKUP_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/portfolio_db_backup_${TIMESTAMP}.sql"

mkdir -p "${BACKUP_DIR}"

echo "Đang thực hiện sao lưu cơ sở dữ liệu portfolio_db..."
docker exec -i portfolio_mysql /usr/bin/mysqldump -u portfolio_user -pPortfolioSecurePass2026! portfolio_db > "${BACKUP_FILE}"

if [ $? -eq 0 ]; then
    echo "Sao lưu thành công: ${BACKUP_FILE}"
else
    echo "Lỗi trong quá trình sao lưu!"
    exit 1
fi
