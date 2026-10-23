import React from 'react';
import { Heart, Shield, Code2, Server } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          Phan Quang Tùng — MSSV: DTC245200250
        </div>
        <div style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Đề tài 13: Website Portfolio Cá nhân và Triển khai Hệ thống bằng Docker Compose
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', fontSize: '0.85rem' }}>
          <span>Lớp: CNTTK23E</span>
          <span>•</span>
          <span>Khoa Công nghệ Thông tin</span>
          <span>•</span>
          <span>Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU)</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', marginTop: '0.5rem' }}>
          <Shield size={14} />
          <span>Hardened Docker Architecture</span>
          <span>•</span>
          <Server size={14} />
          <span>Nginx + MySQL 8 + Observability</span>
        </div>
        <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '1rem' }}>
          © 2026 Phan Quang Tùng. Báo cáo Bài tập lớn Triển khai & Quản trị Hệ thống Phần mềm.
        </div>
      </div>
    </footer>
  );
};
