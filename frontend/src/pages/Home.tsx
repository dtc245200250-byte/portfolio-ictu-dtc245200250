import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero.js';
import { About } from '../components/About.js';
import { Skills } from '../components/Skills.js';
import { Projects } from '../components/Projects.js';
import { Education } from '../components/Education.js';
import { Achievements } from '../components/Achievements.js';
import { Contact } from '../components/Contact.js';
import { api } from '../services/api.js';

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profRes, skillRes, projRes, eduRes, achRes] = await Promise.allSettled([
        api.getProfile(),
        api.getSkills(),
        api.getProjects(),
        api.getEducation(),
        api.getAchievements(),
      ]);

      if (profRes.status === 'fulfilled' && profRes.value.success) {
        setProfile(profRes.value.data);
      }
      if (skillRes.status === 'fulfilled' && skillRes.value.success) {
        setSkills(skillRes.value.data);
      }
      if (projRes.status === 'fulfilled' && projRes.value.success) {
        setProjects(projRes.value.data);
      }
      if (eduRes.status === 'fulfilled' && eduRes.value.success) {
        setEducation(eduRes.value.data);
      }
      if (achRes.status === 'fulfilled' && achRes.value.success) {
        setAchievements(achRes.value.data);
      }
    } catch (err) {
      console.error('Error fetching home data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading && !profile) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginBottom: '1rem' }}>
            Đang tải dữ liệu Portfolio...
          </div>
          <p style={{ color: 'var(--text-muted)' }}>Hệ thống đang kết nối qua Nginx Reverse Proxy tới MySQL 8...</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Education education={education} />
      <Achievements achievements={achievements} />
      <Contact profile={profile} />
    </main>
  );
};
