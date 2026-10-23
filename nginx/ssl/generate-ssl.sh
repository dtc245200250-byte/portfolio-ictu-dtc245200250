#!/bin/sh
# Script sinh chứng chỉ SSL tự ký cho Nginx Reverse Proxy
# Đề tài 13 - Triển khai và Quản trị Hệ thống Phần mềm
# Sinh viên: Phan Quang Tùng - MSSV: DTC245200250

mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/cert.pem ] || [ ! -f /etc/nginx/ssl/key.pem ]; then
    echo "Đang khởi tạo chứng chỉ SSL tự ký cho localhost..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/key.pem \
        -out /etc/nginx/ssl/cert.pem \
        -subj "/C=VN/ST=Thai Nguyen/L=Thai Nguyen City/O=ICTU/OU=CNTT/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
    echo "Khởi tạo SSL hoàn tất."
else
    echo "Chứng chỉ SSL đã tồn tại."
fi
