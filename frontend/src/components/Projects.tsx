import React, { useState } from 'react';
import { Github, ExternalLink, Star } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string;
  github_url?: string;
  live_url?: string;
  thumbnail_url?: string;
  featured?: boolean;
}

interface ProjectsProps {
  projects: Project[];
}

export const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const filteredProjects = filter === 'featured'
    ? projects.filter((p) => p.featured)
    : projects;

  return (
    <section id="projects" className="section" style={{ backgroundColor: 'white' }}>
      <div className="container">
        <div className="section-title-wrap">
          <div className="section-badge">Sản phẩm Thực tế</div>
          <h2 className="section-title">Dự án Tiêu biểu & Ứng dụng</h2>
          <p className="section-subtitle">
            Các sản phẩm phần mềm thực tế đã triển khai và đóng gói container trong chương trình học tại ICTU.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
            <button
              onClick={() => setFilter('all')}
              className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Tất cả dự án ({projects.length})
            </button>
            <button
              onClick={() => setFilter('featured')}
              className={`btn btn-sm ${filter === 'featured' ? 'btn-primary' : 'btn-secondary'}`}
            >
              Dự án nổi bật ({projects.filter((p) => p.featured).length})
            </button>
          </div>
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => {
            const techs = project.technologies.split(',').map((t) => t.trim());

            return (
              <div key={project.id} className="project-card">
                {project.thumbnail_url && (
                  <img
                    src={project.thumbnail_url}
                    alt={project.title}
                    className="project-thumb"
                  />
                )}
                <div className="project-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <h3 className="project-title">{project.title}</h3>
                    {project.featured && (
                      <span className="badge badge-warning" title="Dự án nổi bật">
                        <Star size={12} fill="#b45309" /> Nổi bật
                      </span>
                    )}
                  </div>

                  <p className="project-desc">{project.description}</p>

                  <div className="project-techs">
                    {techs.map((tech, idx) => (
                      <span key={idx} className="project-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <Github size={14} /> Mã nguồn
                      </a>
                    )}
                    {project.live_url && project.live_url !== '#' && (
                      <a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <ExternalLink size={14} /> Truy cập Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
