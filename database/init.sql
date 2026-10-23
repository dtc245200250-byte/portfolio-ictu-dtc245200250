-- ==============================================================================
-- CƠ SỞ DỮ LIỆU WEBSITE PORTFOLIO CÁ NHÂN - ĐỀ TÀI 13
-- Sinh viên: Phan Quang Tùng - MSSV: DTC245200250 - Lớp: CNTTK23E
-- Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU)
-- ==============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

CREATE DATABASE IF NOT EXISTS `portfolio_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `portfolio_db`;

-- 1. BẢNG QUẢN TRỊ VIÊN (ADMINS)
CREATE TABLE IF NOT EXISTS `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `role` VARCHAR(20) DEFAULT 'admin',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG THÔNG TIN CÁ NHÂN (PROFILE)
CREATE TABLE IF NOT EXISTS `profile` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `student_id` VARCHAR(20) NOT NULL,
    `class_name` VARCHAR(50) NOT NULL,
    `major` VARCHAR(100) NOT NULL,
    `university` VARCHAR(150) NOT NULL,
    `faculty` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `bio` TEXT NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(20) DEFAULT '',
    `location` VARCHAR(100) DEFAULT 'Thái Nguyên, Việt Nam',
    `avatar_url` VARCHAR(255) DEFAULT '',
    `github_url` VARCHAR(255) DEFAULT '',
    `linkedin_url` VARCHAR(255) DEFAULT '',
    `facebook_url` VARCHAR(255) DEFAULT '',
    `cv_url` VARCHAR(255) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG KỸ NĂNG (SKILLS)
CREATE TABLE IF NOT EXISTS `skills` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `category` VARCHAR(50) NOT NULL, -- 'Frontend', 'Backend', 'DevOps & Cloud', 'Database & Tools'
    `name` VARCHAR(50) NOT NULL,
    `proficiency` INT DEFAULT 80, -- 1 to 100%
    `icon` VARCHAR(50) DEFAULT 'code',
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG DỰ ÁN (PROJECTS)
CREATE TABLE IF NOT EXISTS `projects` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NOT NULL,
    `technologies` VARCHAR(255) NOT NULL,
    `github_url` VARCHAR(255) DEFAULT '',
    `live_url` VARCHAR(255) DEFAULT '',
    `thumbnail_url` VARCHAR(255) DEFAULT '',
    `featured` BOOLEAN DEFAULT FALSE,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG HỌC VẤN (EDUCATION)
CREATE TABLE IF NOT EXISTS `education` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `institution` VARCHAR(150) NOT NULL,
    `degree` VARCHAR(100) NOT NULL,
    `major` VARCHAR(100) NOT NULL,
    `start_year` VARCHAR(10) NOT NULL,
    `end_year` VARCHAR(10) NOT NULL,
    `gpa` VARCHAR(20) DEFAULT '',
    `description` TEXT,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. BẢNG THÀNH TÍCH & CHỨNG CHỈ (ACHIEVEMENTS)
CREATE TABLE IF NOT EXISTS `achievements` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(150) NOT NULL,
    `issuer` VARCHAR(100) NOT NULL,
    `date_achieved` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `credential_url` VARCHAR(255) DEFAULT '',
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. BẢNG TIN NHẮN LIÊN HỆ (CONTACT_MESSAGES)
CREATE TABLE IF NOT EXISTS `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sender_name` VARCHAR(100) NOT NULL,
    `sender_email` VARCHAR(100) NOT NULL,
    `subject` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- DỮ LIỆU KHỞI TẠO (SEED DATA)
-- ==============================================================================

-- 1. Khởi tạo tài khoản quản trị mặc định (Mật khẩu: AdminSecurePassword2026!)
-- Hash bcrypt 10 rounds: $2a$10$w3U/l3/qfN278Eskh63qxej4r4Hrk8y1bZJ9Pekq02Z73J4YgG5fK
-- (Backend cũng sẽ tự động kiểm tra và khởi tạo tài khoản từ biến môi trường)
INSERT INTO `admins` (`id`, `username`, `password_hash`, `full_name`, `email`, `role`)
VALUES (
    1,
    'admin',
    '$2b$10$eF0NK9fgIQkf77N8JfIUTOk6VDzD1Il9mrzkMmdpPKevWQsOZxReC',
    'Phan Quang Tùng',
    'phantung121206@gmail.com',
    'superadmin'
) ON DUPLICATE KEY UPDATE `password_hash`='$2b$10$eF0NK9fgIQkf77N8JfIUTOk6VDzD1Il9mrzkMmdpPKevWQsOZxReC';

-- 2. Thông tin Profile của sinh viên Phan Quang Tùng
INSERT INTO `profile` (
    `id`, `full_name`, `student_id`, `class_name`, `major`, `university`, `faculty`,
    `title`, `bio`, `email`, `phone`, `location`, `avatar_url`, `github_url`, `linkedin_url`, `facebook_url`, `cv_url`
) VALUES (
    1,
    'Phan Quang Tùng',
    'DTC245200250',
    'CNTTK23E',
    'Công nghệ Thông tin',
    'Trường Đại học Công nghệ Thông tin và Truyền thông',
    'Khoa Công nghệ Thông tin',
    'Full-Stack Developer & DevOps Engineer',
    'Sinh viên ngành Công nghệ Thông tin tại ICTU với niềm đam mê sâu sắc về kỹ thuật phần mềm full-stack, kiến trúc Container hóa với Docker Compose, triển khai hệ thống Nginx Reverse Proxy, và thiết lập hạ tầng giám sát observability toàn diện với Prometheus, Grafana và Loki.',
    'phantung121206@gmail.com',
    '0987654321',
    'Thái Nguyên, Việt Nam',
    'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=600&q=80',
    'https://github.com/dtc245200250-byte',
    'https://linkedin.com/in/dtc245200250',
    'https://facebook.com/dtc245200250',
    '#'
) ON DUPLICATE KEY UPDATE `full_name`=`full_name`;

-- 3. Kỹ năng lập trình & công nghệ
INSERT INTO `skills` (`category`, `name`, `proficiency`, `icon`, `display_order`) VALUES
('Frontend', 'React.js & TypeScript', 90, 'react', 1),
('Frontend', 'Vite & Modern CSS', 88, 'code', 2),
('Frontend', 'HTML5 & Responsive Web', 95, 'layout', 3),
('Backend', 'Node.js & Express.js', 92, 'server', 4),
('Backend', 'RESTful API Design', 90, 'api', 5),
('Backend', 'Authentication & JWT Security', 85, 'shield', 6),
('Database & Tools', 'MySQL 8 & Database Design', 88, 'database', 7),
('Database & Tools', 'phpMyAdmin & SQL Tuning', 85, 'table', 8),
('DevOps & Cloud', 'Docker & Docker Compose', 92, 'container', 9),
('DevOps & Cloud', 'Nginx Reverse Proxy & SSL', 88, 'globe', 10),
('DevOps & Cloud', 'Prometheus & Grafana Monitoring', 85, 'activity', 11),
('DevOps & Cloud', 'Loki & Promtail Centralized Logging', 82, 'file-text', 12);

-- 4. Dự án tiêu biểu
INSERT INTO `projects` (`title`, `description`, `technologies`, `github_url`, `live_url`, `thumbnail_url`, `featured`, `display_order`) VALUES
(
    'Hệ thống Website Portfolio & Giám sát Docker (Đề tài 13)',
    'Hệ thống Portfolio cá nhân đa dịch vụ hoàn chỉnh tích hợp xác thực Admin, Reverse Proxy Nginx với SSL, giám sát hiệu năng với Prometheus + Grafana và thu thập log tập trung với Loki + Promtail.',
    'React, TypeScript, Express, MySQL 8, Docker Compose, Nginx, Prometheus, Grafana, Loki',
    'https://github.com/dtc245200250-byte/portfolio-ictu-dtc245200250',
    'http://localhost:8080',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    TRUE,
    1
),
(
    'Hệ thống Quản lý Sinh viên & Điểm số Trực tuyến',
    'Ứng dụng quản trị đào tạo phân quyền theo vai trò (Giảng viên, Sinh viên, Quản trị viên), báo cáo kết quả học tập và tạo thời khóa biểu tự động.',
    'Node.js, Express, MySQL, Bootstrap 5, Chart.js',
    'https://github.com/dtc245200250-byte',
    '#',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
    TRUE,
    2
),
(
    'Hệ thống Thương mại Điện tử Mini (E-Commerce Platform)',
    'Nền tảng mua sắm trực tuyến với tính năng giỏ hàng, đặt hàng, quản trị kho hàng và tích hợp cổng thanh toán mô phỏng.',
    'React, Redux Toolkit, TailwindCSS, Express.js, MySQL',
    'https://github.com/dtc245200250-byte',
    '#',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    FALSE,
    3
);

-- 5. Học vấn
INSERT INTO `education` (`institution`, `degree`, `major`, `start_year`, `end_year`, `gpa`, `description`, `display_order`) VALUES
(
    'Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU)',
    'Cử nhân Công nghệ Thông tin',
    'Công nghệ Thông tin',
    '2022',
    '2026',
    '3.5 / 4.0',
    'Đào tạo toàn diện về kiến trúc hệ thống, phát triển ứng dụng Web, quản trị hạ tầng phần mềm với Docker, cơ sở dữ liệu quan hệ và an toàn thông tin.',
    1
);

-- 6. Thành tích & Chứng nhận
INSERT INTO `achievements` (`title`, `issuer`, `date_achieved`, `description`, `credential_url`, `display_order`) VALUES
(
    'Hoàn thành Xuất sắc Bài tập lớn Triển khai & Quản trị HTPM',
    'Khoa Công nghệ Thông tin - ICTU',
    '10/2026',
    'Đạt điểm đánh giá cao cho kiến trúc triển khai container hóa toàn diện với Docker Compose, bảo mật Nginx và hạ tầng observability.',
    '#',
    1
),
(
    'Chứng nhận Docker & Container Fundamentals',
    'Khoa CNTT - ICTU',
    '05/2025',
    'Chứng chỉ hoàn thành chương trình đào tạo về đóng gói ứng dụng, tối ưu Dockerfile đa tầng và điều phối container.',
    '#',
    2
);

-- 7. Tin nhắn liên hệ mẫu
INSERT INTO `contact_messages` (`sender_name`, `sender_email`, `subject`, `message`, `is_read`) VALUES
(
    'TS. Giảng viên Hướng dẫn',
    'gvhd@ictu.edu.vn',
    'Đánh giá tiến độ Đề tài 13',
    'Hệ thống portfolio và triển khai Docker của sinh viên Phan Quang Tùng đáp ứng rất tốt các yêu cầu đề ra về cả ứng dụng, reverse proxy và monitoring.',
    TRUE
);

-- 8. Cấu hình xác thực tương thích cho phpMyAdmin
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'RootSuperSecurePass2026!';
ALTER USER IF EXISTS 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'RootSuperSecurePass2026!';
ALTER USER IF EXISTS 'portfolio_user'@'%' IDENTIFIED WITH mysql_native_password BY 'PortfolioSecurePass2026!';
FLUSH PRIVILEGES;
