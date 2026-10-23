import React from 'react';
import { Terminal, Layout, Server, Database, Cloud } from 'lucide-react';

interface Skill {
  id: number;
  category: string;
  name: string;
  proficiency: number;
  icon?: string;
  display_order?: number;
}

interface SkillsProps {
  skills: Skill[];
}

export const Skills: React.FC<SkillsProps> = ({ skills }) => {
  // Group skills by category
  const categories = ['Frontend', 'Backend', 'Database & Tools', 'DevOps & Cloud'];

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Frontend':
        return <Layout size={20} color="#2563eb" />;
      case 'Backend':
        return <Server size={20} color="#10b981" />;
      case 'Database & Tools':
        return <Database size={20} color="#f59e0b" />;
      case 'DevOps & Cloud':
        return <Cloud size={20} color="#0ea5e9" />;
      default:
        return <Terminal size={20} color="#64748b" />;
    }
  };

  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Năng lực Kỹ thuật</div>
          <h2 className="section-title">Kỹ năng Chuyên môn & Công nghệ</h2>
          <p className="section-subtitle">
            Các ngôn ngữ lập trình, hệ quản trị cơ sở dữ liệu và công cụ DevOps được đào tạo bài bản và ứng dụng thực tế.
          </p>
        </div>

        <div className="skills-categories">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="skill-category-card">
                <div className="skill-category-header">
                  {getCategoryIcon(cat)}
                  <h3>{cat}</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {catSkills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-item-info">
                        <span style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>{skill.name}</span>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{skill.proficiency}%</span>
                      </div>
                      <div className="skill-progress-bg">
                        <div
                          className="skill-progress-bar"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
