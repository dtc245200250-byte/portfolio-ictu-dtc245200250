import React, { useState, useEffect } from 'react';
import {
  Layers,
  Code2,
  GraduationCap,
  Award,
  Mail,
  User,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Lock,
  Activity,
  Server,
  Database,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';

interface AdminDashboardProps {
  onBackToHome: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome }) => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'projects' | 'skills' | 'education' | 'achievements' | 'messages' | 'security'>('overview');

  // Stats & Entities State
  const [stats, setStats] = useState<any>(null);
  const [profile, setProfile] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  // Modals state
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [editingAch, setEditingAch] = useState<any | null>(null);

  // Password change form
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const showNotice = (text: string, type: 'success' | 'danger' = 'success') => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const loadAll = async () => {
    try {
      const [sRes, pRes, prRes, skRes, edRes, acRes, mRes] = await Promise.allSettled([
        api.getAdminStats(),
        api.getProfile(),
        api.getProjects(),
        api.getSkills(),
        api.getEducation(),
        api.getAchievements(),
        api.getMessages(),
      ]);

      if (sRes.status === 'fulfilled' && sRes.value.success) setStats(sRes.value.data);
      if (pRes.status === 'fulfilled' && pRes.value.success) setProfile(pRes.value.data);
      if (prRes.status === 'fulfilled' && prRes.value.success) setProjects(prRes.value.data);
      if (skRes.status === 'fulfilled' && skRes.value.success) setSkills(skRes.value.data);
      if (edRes.status === 'fulfilled' && edRes.value.success) setEducation(edRes.value.data);
      if (acRes.status === 'fulfilled' && acRes.value.success) setAchievements(acRes.value.data);
      if (mRes.status === 'fulfilled' && mRes.value.success) setMessages(mRes.value.data);
    } catch (err: any) {
      showNotice('Lỗi tải dữ liệu: ' + err.message, 'danger');
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // --- CRUD HANDLERS ---
  // Profile update
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.updateProfile(profile);
      if (res.success) showNotice('Cập nhật hồ sơ thành công!');
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Projects
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject.id) {
        await api.updateProject(editingProject.id, editingProject);
        showNotice('Cập nhật dự án thành công!');
      } else {
        await api.createProject(editingProject);
        showNotice('Thêm dự án mới thành công!');
      }
      setEditingProject(null);
      const res = await api.getProjects();
      if (res.success) setProjects(res.data);
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dự án này?')) return;
    try {
      await api.deleteProject(id);
      showNotice('Đã xóa dự án!');
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Skills
  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill.id) {
        await api.updateSkill(editingSkill.id, editingSkill);
        showNotice('Cập nhật kỹ năng thành công!');
      } else {
        await api.createSkill(editingSkill);
        showNotice('Thêm kỹ năng mới thành công!');
      }
      setEditingSkill(null);
      const res = await api.getSkills();
      if (res.success) setSkills(res.data);
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  const handleDeleteSkill = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa kỹ năng này?')) return;
    try {
      await api.deleteSkill(id);
      showNotice('Đã xóa kỹ năng!');
      setSkills(skills.filter((s) => s.id !== id));
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Education
  const handleSaveEdu = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu.id) {
        await api.updateEducation(editingEdu.id, editingEdu);
        showNotice('Cập nhật học vấn thành công!');
      } else {
        await api.createEducation(editingEdu);
        showNotice('Thêm mục học vấn thành công!');
      }
      setEditingEdu(null);
      const res = await api.getEducation();
      if (res.success) setEducation(res.data);
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  const handleDeleteEdu = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mục học vấn này?')) return;
    try {
      await api.deleteEducation(id);
      showNotice('Đã xóa mục học vấn!');
      setEducation(education.filter((e) => e.id !== id));
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Achievements
  const handleSaveAch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAch.id) {
        await api.updateAchievement(editingAch.id, editingAch);
        showNotice('Cập nhật thành tích thành công!');
      } else {
        await api.createAchievement(editingAch);
        showNotice('Thêm thành tích thành công!');
      }
      setEditingAch(null);
      const res = await api.getAchievements();
      if (res.success) setAchievements(res.data);
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  const handleDeleteAch = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành tích này?')) return;
    try {
      await api.deleteAchievement(id);
      showNotice('Đã xóa thành tích!');
      setAchievements(achievements.filter((a) => a.id !== id));
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Messages
  const handleToggleRead = async (id: number, currentRead: boolean) => {
    try {
      await api.markMessageRead(id, !currentRead);
      setMessages(
        messages.map((m) => (m.id === id ? { ...m, is_read: !currentRead ? 1 : 0 } : m))
      );
      showNotice('Đã cập nhật trạng thái tin nhắn!');
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!window.confirm('Xóa tin nhắn liên hệ này?')) return;
    try {
      await api.deleteMessage(id);
      setMessages(messages.filter((m) => m.id !== id));
      showNotice('Đã xóa tin nhắn!');
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  // Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.changePassword(passwords);
      if (res.success) {
        showNotice('Đổi mật khẩu thành công!');
        setPasswords({ currentPassword: '', newPassword: '' });
      }
    } catch (err: any) {
      showNotice(err.message, 'danger');
    }
  };

  return (
    <div className="admin-layout">
      {/* Top Header */}
      <header className="admin-header">
        <div className="admin-header-title">
          <Server size={24} color="#2563eb" />
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Bảng Quản trị Nội dung (Admin Panel)</h1>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Xin chào, <strong>{user?.fullName || user?.username}</strong> • Vai trò: <span className="badge badge-primary">{user?.role || 'Admin'}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button onClick={onBackToHome} className="btn btn-secondary btn-sm" style={{ gap: '0.35rem' }}>
            <Eye size={16} /> Xem Website Thực tế
          </button>
          <button onClick={logout} className="btn btn-outline btn-sm" style={{ gap: '0.35rem', color: 'var(--danger)' }}>
            <LogOut size={16} /> Đăng Xuất
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container" style={{ padding: '2rem 1.5rem', flexGrow: 1 }}>
        {feedback && (
          <div className={`alert alert-${feedback.type}`}>
            {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <Activity size={18} /> Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User size={18} /> Thông tin Cá nhân
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
          >
            <Layers size={18} /> Quản lý Dự án ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
          >
            <Code2 size={18} /> Quản lý Kỹ năng ({skills.length})
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`admin-tab ${activeTab === 'education' ? 'active' : ''}`}
          >
            <GraduationCap size={18} /> Học vấn ({education.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`admin-tab ${activeTab === 'achievements' ? 'active' : ''}`}
          >
            <Award size={18} /> Thành tích ({achievements.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
          >
            <Mail size={18} /> Tin nhắn Liên hệ ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`admin-tab ${activeTab === 'security' ? 'active' : ''}`}
          >
            <Lock size={18} /> Đổi Mật khẩu
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon"><Layers size={24} /></div>
                <div>
                  <div className="stat-value">{stats?.totalProjects ?? projects.length}</div>
                  <div className="stat-label">Tổng số Dự án</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}><Code2 size={24} /></div>
                <div>
                  <div className="stat-value">{stats?.totalSkills ?? skills.length}</div>
                  <div className="stat-label">Kỹ năng Công nghệ</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}><Mail size={24} /></div>
                <div>
                  <div className="stat-value">{stats?.totalMessages ?? messages.length}</div>
                  <div className="stat-label">Tin nhắn Khách gửi</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}><Database size={24} /></div>
                <div>
                  <div className="stat-value" style={{ fontSize: '1.25rem' }}>{stats?.dbEngine || 'MySQL 8'}</div>
                  <div className="stat-label">Hệ Quản trị CSDL</div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Trạng thái Hệ thống Đề tài 13</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: '1.6' }}>
                Hệ thống đang hoạt động dưới quyền người dùng non-root bên trong container Docker Compose. Nginx đứng phía trước điều phối lưu lượng tới dịch vụ Frontend và Backend API, kết nối tới cơ sở dữ liệu MySQL nội bộ và được giám sát toàn diện bởi Prometheus, Grafana và Loki.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span className="badge badge-success">Backend Health: Hoạt động bình thường</span>
                <span className="badge badge-primary">Docker Isolation: Mạng backend_net cô lập</span>
                <span className="badge badge-warning">phpMyAdmin: Cổng quản trị 8088 / /pma</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div className="card" style={{ maxWidth: '800px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Chỉnh sửa Thông tin Cá nhân & Sinh viên</h3>
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Mã số sinh viên (MSSV) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.student_id || ''}
                    onChange={(e) => setProfile({ ...profile, student_id: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Lớp sinh hoạt *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.class_name || ''}
                    onChange={(e) => setProfile({ ...profile, class_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngành đào tạo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.major || ''}
                    onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tiêu đề nghề nghiệp (Title)</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.title || ''}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tiểu sử giới thiệu (Bio)</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Email liên hệ</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.phone || ''}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Địa chỉ</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.location || ''}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Đường dẫn ảnh đại diện (URL)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.avatar_url || ''}
                    onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Liên kết GitHub</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.github_url || ''}
                  onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                Lưu Thay Đổi Hồ Sơ
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PROJECTS */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Danh sách Dự án Cá nhân</h3>
              <button
                onClick={() => setEditingProject({ title: '', description: '', technologies: '', github_url: '', live_url: '', thumbnail_url: '', featured: false, display_order: 0 })}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Plus size={16} /> Thêm Dự Án Mới
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Dự Án</th>
                    <th>Công Nghệ</th>
                    <th>Nổi bật</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((proj, idx) => (
                    <tr key={proj.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{proj.title}</strong></td>
                      <td>{proj.technologies}</td>
                      <td>
                        {proj.featured ? (
                          <span className="badge badge-success">Có</span>
                        ) : (
                          <span className="badge badge-secondary">Không</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="btn btn-secondary btn-sm"
                            title="Sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="btn btn-danger btn-sm"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {projects.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                        Chưa có dự án nào trong cơ sở dữ liệu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Edit/Create Project */}
            {editingProject && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingProject.id ? 'Sửa Dự Án' : 'Thêm Dự Án Mới'}</h3>
                    <button onClick={() => setEditingProject(null)} className="btn btn-sm">✕</button>
                  </div>
                  <form onSubmit={handleSaveProject}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label className="form-label">Tên Dự án *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mô tả Dự án *</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editingProject.description || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Công nghệ sử dụng (ngăn cách bằng dấu phẩy) *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="React, TypeScript, MySQL, Docker..."
                          value={editingProject.technologies || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value })}
                          required
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Đường dẫn GitHub</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingProject.github_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, github_url: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Đường dẫn Demo / Live</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingProject.live_url || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, live_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Ảnh Thumbnail (URL)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingProject.thumbnail_url || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, thumbnail_url: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                          type="checkbox"
                          id="featured_check"
                          checked={Boolean(editingProject.featured)}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                        />
                        <label htmlFor="featured_check" style={{ fontSize: '0.92rem', cursor: 'pointer' }}>
                          Đánh dấu là Dự án Tiêu biểu (Featured)
                        </label>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={() => setEditingProject(null)} className="btn btn-secondary">
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Lưu Dữ Liệu
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SKILLS */}
        {activeTab === 'skills' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Quản lý Kỹ năng Chuyên môn</h3>
              <button
                onClick={() => setEditingSkill({ category: 'Frontend', name: '', proficiency: 85, icon: 'code', display_order: 0 })}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Plus size={16} /> Thêm Kỹ Năng
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Danh mục</th>
                    <th>Tên Kỹ Năng</th>
                    <th>Mức độ</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((skill, idx) => (
                    <tr key={skill.id}>
                      <td>{idx + 1}</td>
                      <td><span className="badge badge-secondary">{skill.category}</span></td>
                      <td><strong>{skill.name}</strong></td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{skill.proficiency}%</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => setEditingSkill(skill)}
                            className="btn btn-secondary btn-sm"
                            title="Sửa"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="btn btn-danger btn-sm"
                            title="Xóa"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Skill */}
            {editingSkill && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingSkill.id ? 'Sửa Kỹ Năng' : 'Thêm Kỹ Năng Mới'}</h3>
                    <button onClick={() => setEditingSkill(null)} className="btn btn-sm">✕</button>
                  </div>
                  <form onSubmit={handleSaveSkill}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label className="form-label">Danh mục *</label>
                        <select
                          className="form-control"
                          value={editingSkill.category || 'Frontend'}
                          onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database & Tools">Database & Tools</option>
                          <option value="DevOps & Cloud">DevOps & Cloud</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Tên Kỹ năng *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Docker, React, MySQL..."
                          value={editingSkill.name || ''}
                          onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Mức độ thành thạo (% từ 1 đến 100): {editingSkill.proficiency}%</label>
                        <input
                          type="range"
                          min="1"
                          max="100"
                          style={{ width: '100%' }}
                          value={editingSkill.proficiency || 80}
                          onChange={(e) => setEditingSkill({ ...editingSkill, proficiency: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={() => setEditingSkill(null)} className="btn btn-secondary">
                        Hủy
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Lưu Kỹ Năng
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EDUCATION */}
        {activeTab === 'education' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Quản lý Học vấn & Đào tạo</h3>
              <button
                onClick={() => setEditingEdu({ institution: '', degree: '', major: '', start_year: '2022', end_year: '2026', gpa: '', description: '' })}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Plus size={16} /> Thêm Mục Học Vấn
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Cơ sở Đào tạo</th>
                    <th>Văn bằng</th>
                    <th>Thời gian</th>
                    <th>GPA</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {education.map((edu, idx) => (
                    <tr key={edu.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{edu.institution}</strong></td>
                      <td>{edu.degree} ({edu.major})</td>
                      <td>{edu.start_year} - {edu.end_year}</td>
                      <td>{edu.gpa || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setEditingEdu(edu)} className="btn btn-secondary btn-sm"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteEdu(edu.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Edu */}
            {editingEdu && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingEdu.id ? 'Sửa Học Vấn' : 'Thêm Mục Học Vấn'}</h3>
                    <button onClick={() => setEditingEdu(null)} className="btn btn-sm">✕</button>
                  </div>
                  <form onSubmit={handleSaveEdu}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label className="form-label">Tên Cơ sở Đào tạo *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingEdu.institution || ''}
                          onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Văn bằng *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingEdu.degree || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Ngành đào tạo *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingEdu.major || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, major: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Năm bắt đầu</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingEdu.start_year || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, start_year: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Năm kết thúc</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingEdu.end_year || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, end_year: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GPA</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingEdu.gpa || ''}
                            onChange={(e) => setEditingEdu({ ...editingEdu, gpa: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mô tả thêm</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editingEdu.description || ''}
                          onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={() => setEditingEdu(null)} className="btn btn-secondary">Hủy</button>
                      <button type="submit" className="btn btn-primary">Lưu</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem' }}>Quản lý Thành tích & Chứng chỉ</h3>
              <button
                onClick={() => setEditingAch({ title: '', issuer: '', date_achieved: '', description: '', credential_url: '' })}
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <Plus size={16} /> Thêm Thành Tích
              </button>
            </div>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên Thành tích</th>
                    <th>Đơn vị cấp</th>
                    <th>Ngày đạt được</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {achievements.map((ach, idx) => (
                    <tr key={ach.id}>
                      <td>{idx + 1}</td>
                      <td><strong>{ach.title}</strong></td>
                      <td>{ach.issuer}</td>
                      <td>{ach.date_achieved}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => setEditingAch(ach)} className="btn btn-secondary btn-sm"><Edit2 size={14} /></button>
                          <button onClick={() => handleDeleteAch(ach.id)} className="btn btn-danger btn-sm"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Modal Ach */}
            {editingAch && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h3>{editingAch.id ? 'Sửa Thành Tích' : 'Thêm Thành Tích Mới'}</h3>
                    <button onClick={() => setEditingAch(null)} className="btn btn-sm">✕</button>
                  </div>
                  <form onSubmit={handleSaveAch}>
                    <div className="modal-body">
                      <div className="form-group">
                        <label className="form-label">Tên Thành tích / Chứng chỉ *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingAch.title || ''}
                          onChange={(e) => setEditingAch({ ...editingAch, title: e.target.value })}
                          required
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                          <label className="form-label">Đơn vị cấp *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={editingAch.issuer || ''}
                            onChange={(e) => setEditingAch({ ...editingAch, issuer: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Thời gian *</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="10/2026"
                            value={editingAch.date_achieved || ''}
                            onChange={(e) => setEditingAch({ ...editingAch, date_achieved: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mô tả ngắn</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          value={editingAch.description || ''}
                          onChange={(e) => setEditingAch({ ...editingAch, description: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Liên kết xác minh (Credential URL)</label>
                        <input
                          type="text"
                          className="form-control"
                          value={editingAch.credential_url || ''}
                          onChange={(e) => setEditingAch({ ...editingAch, credential_url: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" onClick={() => setEditingAch(null)} className="btn btn-secondary">Hủy</button>
                      <button type="submit" className="btn btn-primary">Lưu</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: MESSAGES */}
        {activeTab === 'messages' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Tin nhắn Liên hệ Từ Khách Thăm quan</h3>

            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Người gửi</th>
                    <th>Email</th>
                    <th>Tiêu đề</th>
                    <th>Nội dung</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg, idx) => (
                    <tr key={msg.id} style={{ backgroundColor: msg.is_read ? 'transparent' : '#f0f9ff' }}>
                      <td>{idx + 1}</td>
                      <td><strong>{msg.sender_name}</strong></td>
                      <td><a href={`mailto:${msg.sender_email}`}>{msg.sender_email}</a></td>
                      <td>{msg.subject}</td>
                      <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap' }}>{msg.message}</td>
                      <td>
                        <button
                          onClick={() => handleToggleRead(msg.id, Boolean(msg.is_read))}
                          className={`badge ${msg.is_read ? 'badge-secondary' : 'badge-primary'}`}
                          style={{ cursor: 'pointer', border: 'none' }}
                        >
                          {msg.is_read ? 'Đã xem' : 'Chưa đọc'}
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="btn btn-danger btn-sm"
                          title="Xóa"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {messages.length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                        Chưa có tin nhắn liên hệ nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: SECURITY */}
        {activeTab === 'security' && (
          <div className="card" style={{ maxWidth: '500px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Bảo mật & Đổi Mật khẩu Quản trị</h3>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label">Mật khẩu Hiện tại *</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu Mới (Tối thiểu 8 ký tự) *</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Cập Nhật Mật Khẩu
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
