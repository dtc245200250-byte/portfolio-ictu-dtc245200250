import React from 'react';
import { User, School, MapPin, Mail, Phone, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

interface AboutProps {
  profile: any;
}

export const About: React.FC<AboutProps> = ({ profile }) => {
  const p = profile || {};

  return (
    <section id="about" className="section" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Hồ sơ năng lực</div>
          <h2 className="section-title">Giới thiệu Bản thân & Định hướng</h2>
          <p className="section-subtitle">
            Hồ sơ học tập, kỹ năng chuyên môn và dự án nghiên cứu thuộc Đề tài 13 môn Triển khai và Quản trị Hệ thống Phần mềm.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} color="#2563eb" />
              <span>Thông tin Sinh viên Thực hiện</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <School size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Cơ sở Đào tạo:</div>
                  <div style={{ fontWeight: 600 }}>Trường Đại học Công nghệ Thông tin và Truyền thông (ICTU)</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Cpu size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Khoa & Ngành đào tạo:</div>
                  <div style={{ fontWeight: 600 }}>Khoa CNTT — {p.major || 'Công nghệ Thông tin'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Địa chỉ liên hệ:</div>
                  <div style={{ fontWeight: 600 }}>{p.location || 'Thái Nguyên, Việt Nam'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Mail size={18} color="#64748b" />
                <div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Email chính thức:</div>
                  <div style={{ fontWeight: 600 }}>{p.email || 'phantung121206@gmail.com'}</div>
                </div>
              </div>

              {p.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Phone size={18} color="#64748b" />
                  <div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Số điện thoại:</div>
                    <div style={{ fontWeight: 600 }}>{p.phone}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="#10b981" />
              <span>Tiêu chuẩn Triển khai Đề tài 13</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.92rem' }}>
                  <strong>Quản lý mã nguồn GitHub:</strong> Lưu trữ đầy đủ toàn bộ source code frontend, backend và các file cấu hình hạ tầng theo đúng 3 mốc commit yêu cầu.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.92rem' }}>
                  <strong>Nginx Reverse Proxy & SSL:</strong> Đóng vai trò cổng API Gateway duy nhất, xử lý SSL tự ký và kích hoạt các HTTP Security Headers nghiêm ngặt.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.92rem' }}>
                  <strong>Observability (Prometheus + Grafana):</strong> Thu thập metrics tài nguyên phần cứng, hiệu năng database MySQL và trạng thái các container qua cAdvisor.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.92rem' }}>
                  <strong>Centralized Logging (Loki + Promtail):</strong> Tự động thu thập log từ mọi container và truy vấn trực tiếp bằng câu lệnh LogQL theo thời gian thực.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ fontSize: '0.92rem' }}>
                  <strong>Hardening an toàn:</strong> Chạy container non-root, cô lập mạng nội bộ backend_net không mở cổng MySQL ra ngoài, quản lý secret bằng .env.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
