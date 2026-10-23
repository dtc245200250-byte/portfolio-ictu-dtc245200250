import React from 'react';
import { Github, Mail, Send, Award, BookOpen, Layers } from 'lucide-react';

interface HeroProps {
  profile: any;
}

export const Hero: React.FC<HeroProps> = ({ profile }) => {
  const p = profile || {
    full_name: 'Phan Quang Tùng',
    student_id: 'DTC245200250',
    class_name: 'CNTTK23E',
    major: 'Công nghệ Thông tin',
    university: 'Trường Đại học Công nghệ Thông tin và Truyền thông',
    faculty: 'Khoa Công nghệ Thông tin',
    title: 'Full-Stack Developer & DevOps Engineer',
    bio: 'Sinh viên ngành Công nghệ Thông tin tại ICTU với niềm đam mê sâu sắc về kỹ thuật phần mềm full-stack, kiến trúc container hóa với Docker Compose, triển khai hệ thống Nginx Reverse Proxy và giải pháp giám sát observability toàn diện.',
    email: 'phantung121206@gmail.com',
    location: 'Thái Nguyên, Việt Nam',
    github_url: 'https://github.com/dtc245200250-byte',
    avatar_url: 'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=600&q=80',
  };

  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-content">
            <div className="section-badge">
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              Đề tài 13 — Triển khai & Quản trị HTPM
            </div>
            <h1>
              Xin chào, tôi là <br />
              <span>{p.full_name}</span>
            </h1>
            <div className="hero-title">{p.title}</div>
            <p className="hero-desc">{p.bio}</p>

            <div className="hero-actions">
              <a href="#projects" className="btn btn-primary btn-lg">
                <Layers size={18} />
                <span>Xem Dự án Thực tế</span>
              </a>
              <a href="#contact" className="btn btn-secondary btn-lg">
                <Mail size={18} />
                <span>Liên hệ Ngay</span>
              </a>
              {p.github_url && (
                <a
                  href={p.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-lg"
                  title="GitHub Repository"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
              )}
            </div>

            <div className="hero-meta-grid">
              <div className="hero-meta-item">
                <span className="hero-meta-label">Mã số sinh viên</span>
                <span className="hero-meta-value">{p.student_id}</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Lớp / Ngành học</span>
                <span className="hero-meta-value">{p.class_name} • {p.major}</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Cơ sở đào tạo</span>
                <span className="hero-meta-value">ICTU — Thái Nguyên</span>
              </div>
              <div className="hero-meta-item">
                <span className="hero-meta-label">Năm báo cáo</span>
                <span className="hero-meta-value">2026</span>
              </div>
            </div>
          </div>

          <div className="hero-image-wrap">
            <div className="hero-card-frame">
              <img
                src={p.avatar_url || 'https://images.unsplash.com/photo-1534972195531-a756b1129f63?auto=format&fit=crop&w=600&q=80'}
                alt={p.full_name}
                className="hero-avatar"
              />
              <div className="hero-student-card">
                <h3>{p.full_name}</h3>
                <p>{p.student_id} — {p.class_name}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-primary">DevOps & Docker</span>
                  <span className="badge badge-success">Full-Stack Dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
