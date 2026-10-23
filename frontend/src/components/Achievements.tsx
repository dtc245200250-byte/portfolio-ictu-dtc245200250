import React from 'react';
import { Award, CheckCircle, ExternalLink } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  issuer: string;
  date_achieved: string;
  description?: string;
  credential_url?: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  return (
    <section id="achievements" className="section" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Thành tích & Chứng nhận</div>
          <h2 className="section-title">Chứng chỉ Chuyên môn & Khen thưởng</h2>
          <p className="section-subtitle">
            Các chứng chỉ hoàn thành học phần, kỹ năng thực hành và thành tích đạt được trong quá trình nghiên cứu.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {achievements.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--primary-light)',
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Award size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {item.title}
                  </h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                    {item.issuer} • {item.date_achieved}
                  </div>
                </div>
              </div>

              {item.description && (
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', flexGrow: 1, marginBottom: '1rem' }}>
                  {item.description}
                </p>
              )}

              {item.credential_url && item.credential_url !== '#' && (
                <a
                  href={item.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ alignSelf: 'flex-start', gap: '0.35rem' }}
                >
                  <ExternalLink size={14} /> Xem Chứng chỉ
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
