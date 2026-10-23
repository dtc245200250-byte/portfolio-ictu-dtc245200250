import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api.js';

interface ContactProps {
  profile: any;
}

export const Contact: React.FC<ContactProps> = ({ profile }) => {
  const p = profile || {};
  const [formData, setFormData] = useState({
    sender_name: '',
    sender_email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sender_name || !formData.sender_email || !formData.message) {
      setStatus({ type: 'danger', message: 'Vui lòng điền đầy đủ họ tên, email và nội dung tin nhắn.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setStatus({ type: 'success', message: res.message || 'Tin nhắn của bạn đã được gửi thành công!' });
        setFormData({ sender_name: '', sender_email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      setStatus({ type: 'danger', message: err.message || 'Lỗi gửi tin nhắn. Vui lòng thử lại sau.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Kết nối Trực tiếp</div>
          <h2 className="section-title">Thông tin & Gửi Tin nhắn Liên hệ</h2>
          <p className="section-subtitle">
            Mọi thông tin phản hồi, trao đổi học thuật hoặc cơ hội thực tập, vui lòng để lại lời nhắn bên dưới.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Kênh Thông tin Chính thức
            </h3>

            <div className="contact-info-item">
              <div className="contact-icon-wrap">
                <Mail size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email sinh viên</div>
                <div style={{ fontWeight: 600 }}>{p.email || 'phantung121206@gmail.com'}</div>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-wrap">
                <Phone size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Điện thoại / Zalo</div>
                <div style={{ fontWeight: 600 }}>{p.phone || '0987654321'}</div>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-icon-wrap">
                <MapPin size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Địa điểm học tập</div>
                <div style={{ fontWeight: 600 }}>Khoa CNTT - Đại học CNTT & Truyền thông Thái Nguyên</div>
              </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <strong>Lưu ý:</strong> Dữ liệu tin nhắn gửi qua biểu mẫu sẽ được lưu trữ an toàn trong cơ sở dữ liệu MySQL và quản lý trong Trang Quản trị Admin.
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>
              Gửi tin nhắn trực tiếp
            </h3>

            {status && (
              <div className={`alert alert-${status.type}`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nguyễn Văn A"
                    value={formData.sender_name}
                    onChange={(e) => setFormData({ ...formData, sender_name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Địa chỉ Email *</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="email@example.com"
                    value={formData.sender_email}
                    onChange={(e) => setFormData({ ...formData, sender_email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề liên hệ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Trao đổi về Đề tài 13 / Hợp tác phát triển..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nội dung tin nhắn *</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Nhập nội dung cần trao đổi tại đây..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', gap: '0.5rem' }}
                disabled={loading}
              >
                <Send size={18} />
                <span>{loading ? 'Đang gửi tin nhắn...' : 'Gửi Tin Nhắn Ngay'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
