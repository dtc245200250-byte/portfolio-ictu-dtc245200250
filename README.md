# 🚀 BÀI TẬP LỚN: TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM
## ĐỀ TÀI 13: XÂY DỰNG WEBSITE PORTFOLIO CÁ NHÂN VÀ TRIỂN KHAI HỆ THỐNG BẰNG DOCKER

<p align="center">
  <img src="docs/assets/logo_ictu_full.png" alt="ICTU Logo" width="380"/>
</p>

<p align="center">
  <a href="https://www.ictu.edu.vn/"><img src="https://img.shields.io/badge/Trường-Đại%20học%20CNTT%20%26%20TT%20(ICTU)-0052CC?style=for-the-badge&logo=school" alt="ICTU"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Mã%20Đề%20Tài-Đề%20Tài%2013-FF5722?style=for-the-badge" alt="Đề tài 13"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Khóa-CNTT%20K23E-009688?style=for-the-badge" alt="K23E"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Năm%20Báo%20Cáo-2026-673AB7?style=for-the-badge" alt="2026"/></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Compose"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=flat-square&logo=nginx&logoColor=white" alt="Nginx"/>
  <img src="https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18"/>
  <img src="https://img.shields.io/badge/Node.js_22-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/MySQL_8.0-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL 8.0"/>
  <img src="https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white" alt="Prometheus"/>
  <img src="https://img.shields.io/badge/Grafana_11-F46800?style=flat-square&logo=grafana&logoColor=white" alt="Grafana"/>
  <img src="https://img.shields.io/badge/Grafana_Loki-F46800?style=flat-square&logo=grafana&logoColor=white" alt="Loki"/>
</p>

---

### 👨‍🎓 THÔNG TIN SINH VIÊN THỰC HIỆN
* **Họ và tên**: **Phan Quang Tùng**
* **Mã số sinh viên (MSSV)**: **`DTC245200250`**
* **Lớp / Khóa**: **CNTTK23E** / Khóa K23
* **Khoa**: Khoa Công nghệ Thông tin
* **Trường**: Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU) - Đại học Thái Nguyên
* **Học phần**: Triển khai và Quản trị Hệ thống Phần mềm
* **Repository GitHub**: [https://github.com/dtc245200250-byte/portfolio-ictu-dtc245200250](https://github.com/dtc245200250-byte/portfolio-ictu-dtc245200250)

---

## 📑 MỤC LỤC
1. [Tổng quan Kiến trúc Hệ thống](#1-tổng-quan-kiến-trúc-hệ-thống)
2. [Bảng Phân bổ Dịch vụ & Cổng Truy cập](#2-bảng-phân-bổ-dịch-vụ--cổng-truy-cập)
3. [Tài khoản Mặc định & Thông tin Bảo mật](#3-tài-khoản-mặc-định--thông-tin-bảo-mật)
4. [Hướng dẫn Cài đặt & Khởi chạy Nhanh](#4-hướng-dẫn-cài-đặt--khởi-chạy-nhanh)
5. [Hệ thống Giám sát Metrics (Prometheus & Grafana)](#5-hệ-thống-giám-sát-metrics-prometheus--grafana)
6. [Hệ thống Quản lý Log tập trung (Loki, Promtail & LogQL)](#6-hệ-thống-quản-lý-log-tập-trung-loki-promtail--logql)
7. [Các Biện pháp Gia cố Bảo mật (Hardening)](#7-các-biện-pháp-gia-cố-bảo-mật-hardening)
8. [Cấu trúc Thư mục Dự án](#8-cấu-trúc-thư-mục-dự-án)
9. [Báo cáo Word & Minh chứng Triển khai](#9-báo-cáo-word--minh-chứng-triển-khai)

---

## 1. 🏗️ TỔNG QUAN KIẾN TRÚC HỆ THỐNG

Hệ sinh thái ứng dụng Portfolio được đóng gói theo kiến trúc Microservices gồm **13 Docker Containers** phối hợp chặt chẽ trên **3 phân vùng mạng Docker biệt lập**:

```
                                [ CLIENT / INTERNET ]
                                          │
                        ┌─────────────────┴─────────────────┐
                        │   Port 8080 (HTTP) / 8443 (HTTPS) │
                        ▼                                   ▼
          ┌───────────────────────────────────────────────────────────────┐
          │                  portfolio_nginx (Reverse Proxy)              │
          │         SSL/TLS Termination (SAN: localhost, 127.0.0.1)       │
          │             OWASP Hardened Security Headers Active            │
          └───────────────────────────────┬───────────────────────────────┘
                                          │ (Internal Network: frontend_net)
              ┌───────────────────────────┴───────────────────────────┐
              ▼                                                       ▼
┌───────────────────────────┐                           ┌───────────────────────────┐
│    portfolio_frontend     │                           │     portfolio_backend     │
│   React 18 + Vite + TS    │                           │ Node.js 22 + Express + TS │
│     Nginx Web Server      │                           │  JWT Auth + Rate Limiter  │
└───────────────────────────┘                           └─────────────┬─────────────┘
                                                                      │ (Internal: backend_net)
                                              ┌───────────────────────┴───────────────────────┐
                                              ▼                                               ▼
                                ┌───────────────────────────┐                   ┌───────────────────────────┐
                                │      portfolio_mysql      │                   │   portfolio_phpmyadmin    │
                                │   MySQL 8.0 Relational DB │                   │    phpMyAdmin UI Web      │
                                │  Volume Persistence Data  │                   │       (Port 8088)         │
                                └─────────────┬─────────────┘                   └───────────────────────────┘
                                              │
              ════════════════════════════════╪═════════════════════════════════════════
                       HẠ TẦNG GIÁM SÁT & QUẢN TRỊ LOG (monitoring_net)
              ════════════════════════════════╪═════════════════════════════════════════
                                              │
          ┌───────────────────────────────────┼───────────────────────────────────┐
          ▼                                   ▼                                   ▼
┌──────────────────┐                ┌──────────────────┐                ┌──────────────────┐
│portfolio_cadvisor│                │portfolio_node_exp│                │portfolio_mysqld_ │
│Container Metrics │                │Host Hardware OS  │                │Database Exporter │
└─────────┬────────┘                └─────────┬────────┘                └─────────┬────────┘
          │                                   │                                   │
          │                                   ▼                                   │
          │                         ┌──────────────────┐                          │
          └────────────────────────>│  portfolio_prom  │<─────────────────────────┘
                                    │Prometheus Server │
                                    │   (Port 9090)    │
                                    └─────────┬────────┘
                                              │
                                              ▼
┌──────────────────┐                ┌──────────────────┐                ┌──────────────────┐
│portfolio_promtail│───────────────>│  portfolio_loki  │───────────────>│portfolio_grafana │
│Log Shipper Daemon│  Push Logs     │Log Storage Engine│   Visualize    │Grafana Dashboard │
│Docker Sock & Files│               │   (Port 3100)    │  Metrics & Logs│   (Port 3000)    │
└──────────────────┘                └──────────────────┘                └──────────────────┘
```

---

## 2. 🌐 BẢNG PHÂN BỔ DỊCH VỤ & CỔNG TRUY CẬP

| STT | Container Name | Dịch vụ | Port Máy chủ (Host) | Port Nội bộ (Container) | Phân vùng Mạng Docker |
| :---: | :--- | :--- | :---: | :---: | :--- |
| **1** | `portfolio_nginx` | Reverse Proxy / SSL Gateway | **`8080`** (HTTP), **`8443`** (HTTPS) | 80, 443 | `frontend_net`, `monitoring_net` |
| **2** | `portfolio_frontend` | Ứng dụng Giao diện Web (SPA) | *(Qua Nginx)* | 80 | `frontend_net` |
| **3** | `portfolio_backend` | RESTful API Backend Service | *(Qua Nginx)* | 5000 | `frontend_net`, `backend_net`, `monitoring_net` |
| **4** | `portfolio_mysql` | Hệ quản trị CSDL MySQL 8.0 | *(Cách ly nội bộ)* | 3306 | `backend_net` |
| **5** | `portfolio_phpmyadmin` | Giao diện Quản trị CSDL | **`8088`** | 80 | `backend_net`, `frontend_net` |
| **6** | `portfolio_prometheus` | Máy chủ Thu thập Metrics TSDB | **`9090`** | 9090 | `monitoring_net`, `backend_net` |
| **7** | `portfolio_grafana` | Bảng điều khiển Trực quan hóa | **`3000`** | 3000 | `monitoring_net` |
| **8** | `portfolio_cadvisor` | Thu thập Metrics Container | *(Nội bộ)* | 8080 | `monitoring_net` |
| **9** | `portfolio_node_exporter`| Thu thập Metrics Máy chủ Host | *(Nội bộ)* | 9100 | `monitoring_net` |
| **10**| `portfolio_mysqld_exporter`| Thu thập Metrics MySQL Engine | *(Nội bộ)* | 9104 | `backend_net`, `monitoring_net` |
| **11**| `portfolio_nginx_exporter`| Thu thập Metrics Nginx Proxy | *(Nội bộ)* | 9113 | `frontend_net`, `monitoring_net` |
| **12**| `portfolio_loki` | Trung tâm Lưu trữ & Chỉ mục Log | **`3100`** | 3100 | `monitoring_net` |
| **13**| `portfolio_promtail` | Log Shipper từ Docker Engine | *(Daemon)* | 9080 | `monitoring_net` |

---

## 3. 🔐 TÀI KHOẢN MẶC ĐỊNH & THÔNG TIN BẢO MẬT

| Hệ thống | Đường dẫn truy cập | Tên người dùng (Username) | Mật khẩu (Password) | Quyền hạn / Ghi chú |
| :--- | :--- | :---: | :---: | :--- |
| **Website Portfolio** | `http://localhost:8080` hoặc `https://localhost:8443` | *Công khai* | *Không yêu cầu* | Xem hồ sơ, kỹ năng, dự án |
| **Trang Admin Panel** | `http://localhost:8080/?view=admin` | **`admin`** | **`AdminSecurePassword2026!`** | Quản trị viên (CRUD toàn quyền) |
| **phpMyAdmin** | `http://localhost:8088` | **`portfolio_user`** | **`PortfolioSecurePass2026!`** | CSDL: `portfolio_db` |
| **phpMyAdmin (Root)** | `http://localhost:8088` | **`root`** | **`MySQLRootSecurePassword2026!`** | Quản trị CSDL cấp cao nhất |
| **Grafana Dashboard** | `http://localhost:3000` | **`admin`** | **`GrafanaSecurePass2026!`** | Tự động đăng nhập Admin (Anonymous Mode) |
| **Prometheus Web UI** | `http://localhost:9090` | *Không yêu cầu* | *Không yêu cầu* | Tra cứu metrics, targets, rules |
| **Loki Log Engine** | `http://localhost:3100` | *Không yêu cầu* | *Không yêu cầu* | REST API query LogQL |

---

## 4. ⚡ HƯỚNG DẪN CÀI ĐẶT & KHỞI CHẠY NHANH

### Yêu cầu Tiền đề (Prerequisites)
* Hệ điều hành: Windows 10/11 (WSL2), Linux Ubuntu 20.04/22.04 LTS hoặc macOS.
* Đã cài đặt **Docker Desktop** (Engine >= 24.0, Compose V2 >= 2.20).
* Git CLI.

### Bước 1: Sao chép Mã nguồn (Clone Repository)
```bash
git clone https://github.com/dtc245200250-byte/portfolio-ictu-dtc245200250.git
cd portfolio-ictu-dtc245200250
```

### Bước 2: Thiết lập Biến Môi trường (.env)
Dự án cung cấp sẵn tệp mẫu `.env.example` với đầy đủ cấu hình chuẩn. Hãy tạo tệp `.env`:
```bash
# Trên Linux/macOS:
cp .env.example .env

# Trên Windows PowerShell:
Copy-Item .env.example .env
```

### Bước 3: Khởi chạy Toàn bộ 13 Containers
```bash
docker compose up -d --build
```

### Bước 4: Kiểm tra Trạng thái Hoạt động
```bash
docker compose ps
```
*Tất cả 13 containers phải đạt trạng thái `Up`, các dịch vụ có healthcheck (MySQL, Backend, Frontend, cAdvisor) sẽ chuyển sang `healthy` sau 10-15 giây.*

---

## 5. 📊 HỆ THỐNG GIÁM SÁT METRICS (PROMETHEUS & GRAFANA)

Prometheus tự động cào số liệu hiệu năng định kỳ mỗi **5 giây** từ 6 Scrape Targets:
1. `prometheus`: Tự giám sát tiến trình Prometheus TSDB (`localhost:9090`).
2. `cadvisor`: Đo lường chi tiết CPU, Memory, Network RX/TX của từng container (`cadvisor:8080`).
3. `node-exporter`: Đo lường phần cứng máy chủ host (Load average, Disk I/O, RAM usage) (`node-exporter:9100`).
4. `mysql-exporter`: Đo lường kết nối MySQL, Queries Per Second (QPS), buffer pool (`mysqld-exporter:9104`).
5. `nginx-exporter`: Đo lường Active connections, Handled requests, Reading/Writing/Waiting (`nginx-exporter:9113`).
6. `portfolio-backend`: Đo lường tài nguyên tiến trình Node.js runtime (`backend:5000/metrics`).

* Kiểm tra trạng thái Targets tại: `http://localhost:9090/targets` (Đảm bảo 100% UP).
* Truy cập Dashboard Grafana được cấu hình sẵn tại: `http://localhost:3000/d/dtc245200250-overview`

---

## 6. 📝 HỆ THỐNG QUẢN LÝ LOG TẬP TRUNG (LOKI, PROMTAIL & LOGQL)

Hệ thống ghi nhận dấu vết sự kiện theo thời gian thực từ mọi container thông qua `promtail` và lưu vào `loki`.

### Script Kiểm thử Tự động 3 Câu truy vấn LogQL:
Chạy lệnh sau tại thư mục gốc của dự án:
```bash
python scripts/test-logql.py
```

### 3 Truy vấn LogQL Tiêu chuẩn đã Kiểm chứng:
1. **Truy vấn 1: Thu thập toàn bộ luồng Log từ Nginx Reverse Proxy**
   ```logql
   {job="portfolio_nginx"}
   ```
   *Mục đích: Giám sát toàn bộ các request truy cập và thông báo trạng thái của Gateway.*

2. **Truy vấn 2: Lọc các HTTP Requests phương thức GET và POST trên Nginx**
   ```logql
   {job="portfolio_nginx"} |~ "(GET|POST)"
   ```
   *Mục đích: Lọc nhanh các tương tác duyệt trang và gửi dữ liệu từ người dùng, loại bỏ log hệ thống.*

3. **Truy vấn 3: Thu thập toàn bộ Application Log từ Backend API**
   ```logql
   {job="portfolio_backend"}
   ```
   *Mục đích: Theo dõi luồng nghiệp vụ API, mã phản hồi 200/400/500 và hiệu năng thực thi.*

---

## 7. 🛡️ CÁC BIỆN PHÁP GIA CỐ BẢO MẬT (HARDENING)

Hệ thống tuân thủ nghiêm ngặt các tiêu chuẩn an toàn thông tin theo yêu cầu Bước 6:
* **Non-root Containers**: Nginx và Frontend cấu hình chạy dưới quyền user `nginx` (UID 101), Backend cấu hình không sử dụng đặc quyền root máy chủ.
* **Network Isolation**: Phân tách 3 mạng nội bộ `frontend_net`, `backend_net`, `monitoring_net`. Cơ sở dữ liệu MySQL không public cổng ra máy chủ host.
* **Bảo vệ Bí mật (.env)**: Tách riêng mật khẩu và Secret Keys vào `.env`, cam kết đưa vào `.gitignore` để tránh rò rỉ mã nguồn.
* **Mã hóa HTTPS & SSL SAN**: Tích hợp chứng chỉ SSL RSA-2048bit hỗ trợ TLS 1.2/1.3 kèm tên miền mở rộng `localhost` và IP `127.0.0.1`.
* **OWASP Security Headers**: Kích hoạt đầy đủ `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy`, và `Content-Security-Policy`.
* **Ẩn Thông tin Phiên bản**: Cấu hình `server_tokens off` trên Nginx nhằm ngăn chặn kẻ tấn công dò quét lỗ hổng đã biết.
* **Chống DoS / Brute-force**: Tích hợp `express-rate-limit` tại API và giới hạn `client_max_body_size 10M` trên Nginx.

---

## 8. 📁 CẤU TRÚC THƯ MỤC DỰ ÁN

```text
├── .env.example                               # File mẫu cấu hình biến môi trường
├── .gitignore                                 # Danh sách loại trừ file nhạy cảm và tài liệu cục bộ
├── docker-compose.yml                         # Tệp điều phối chính 13 Containers Microservices
├── README.md                                  # Hướng dẫn chi tiết triển khai hệ thống (File này)
│
├── backend/                                   # Ứng dụng Backend RESTful API (Node.js + Express + TS)
│   ├── Dockerfile                             # Multi-stage Docker build cho Backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                           # Điểm khởi chạy ứng dụng & API routing
│       ├── config/                            # Cấu hình CSDL và biến môi trường
│       ├── controllers/                       # Xử lý logic nghiệp vụ CRUD & Auth
│       ├── middleware/                        # Xác thực JWT, Helmet, Error handler
│       └── routes/                            # Định nghĩa API endpoints (/api/profile, /api/projects...)
│
├── frontend/                                  # Ứng dụng Frontend Portfolio (React 18 + Vite + TS)
│   ├── Dockerfile                             # Multi-stage Docker build (Node.js builder -> Nginx runner)
│   ├── package.json
│   ├── vite.config.ts
│   ├── nginx-frontend.conf                    # Cấu hình web server Nginx nội bộ cho SPA routing
│   └── src/
│       ├── App.tsx                            # Component gốc & điều hướng View
│       ├── components/                        # UI Components (Navbar, Footer, ProjectCard...)
│       ├── pages/                             # Trang chủ Portfolio, Admin Login, Admin Dashboard
│       └── context/                           # Quản lý trạng thái phiên đăng nhập (AuthContext)
│
├── database/                                  # Khởi tạo Cơ sở dữ liệu MySQL
│   └── init.sql                               # Kịch bản DDL tạo bảng & seed dữ liệu sinh viên Phan Quang Tùng
│
├── nginx/                                     # Cổng Reverse Proxy Ngoại vi & SSL
│   ├── nginx.conf                             # Cấu hình chính Nginx (Worker, Event, Log format, Gzip)
│   ├── conf.d/
│   │   └── default.conf                       # Cấu hình Upstream, Routing HTTP/HTTPS, Security Headers
│   └── ssl/                                   # Chứng chỉ SSL/TLS tự ký (cert.pem, key.pem)
│
├── monitoring/                                # Hệ sinh thái Giám sát & Quản trị Log
│   ├── prometheus/
│   │   └── prometheus.yml                     # Cấu hình Scrape interval và 6 Targets
│   ├── grafana/
│   │   └── provisioning/                      # Tự động nạp Datasources và Dashboards
│   │       ├── datasources/                   # Khai báo Prometheus & Loki datasources
│   │       └── dashboards/                    # Dashboard JSON: Hạ tầng Container & Observability
│   ├── exporters/
│   │   └── my.cnf                             # Thông tin xác thực cho MySQL Exporter
│   ├── loki/
│   │   └── loki-config.yml                    # Cấu hình lưu trữ và schema index cho Loki Server
│   └── promtail/
│       └── promtail-config.yml                # Cấu hình thu thập log từ Docker socket và shared files
│
├── docs/                                      # Tài nguyên thương hiệu
│   └── assets/                                # Logo chính thức ICTU (Full & Crest)
│
└── scripts/                                   # Các kịch bản quản trị hệ thống
    ├── test-logql.py                          # Script kiểm thử và xác thực 3 truy vấn LogQL từ Loki
    ├── backup-db.bat / .sh                    # Script tự động sao lưu CSDL MySQL
    └── restore-db.bat                         # Script tự động phục hồi CSDL MySQL
```

---

<p align="center">
  <b>HỆ THỐNG TRIỂN KHAI VÀ QUẢN TRỊ HỆ THỐNG PHẦN MỀM — ĐỀ TÀI 13</b><br/>
  <i>Khoa Công nghệ Thông tin — Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU) — Năm 2026</i>
</p>
