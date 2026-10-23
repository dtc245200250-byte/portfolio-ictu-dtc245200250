import React from 'react';
import { GraduationCap, Calendar, Award } from 'lucide-react';

interface EducationItem {
  id: number;
  institution: string;
  degree: string;
  major: string;
  start_year: string;
  end_year: string;
  gpa?: string;
  description?: string;
}

interface EducationProps {
  education: EducationItem[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <section id="education" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Học vấn & Bằng cấp</div>
          <h2 className="section-title">Quá trình Đào tạo Đại học</h2>
          <p className="section-subtitle">
            Hành trình học tập và tích lũy kiến thức chuyên sâu tại Trường Đại học Công nghệ Thông tin & Truyền thông.
          </p>
        </div>

        <div className="timeline">
          {education.map((item) => (
            <div key={item.id} className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div className="timeline-period">
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {item.start_year} — {item.end_year}
                  </div>
                  {item.gpa && (
                    <span className="badge badge-success">
                      <Award size={12} /> GPA: {item.gpa}
                    </span>
                  )}
                </div>

                <h3 className="timeline-title">{item.degree}</h3>
                <div className="timeline-subtitle">
                  <GraduationCap size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  {item.institution} • Ngành: {item.major}
                </div>

                {item.description && (
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
