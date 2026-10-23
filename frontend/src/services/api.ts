// ==============================================================================
// API CLIENT - WEBSITE PORTFOLIO (ĐỀ TÀI 13 - PHAN QUANG TÙNG DTC245200250)
// ==============================================================================

const API_BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('portfolio_auth_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('portfolio_auth_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('portfolio_auth_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Không thể phân tích phản hồi từ máy chủ.',
  }));

  if (!response.ok) {
    throw new Error(data.message || `Lỗi HTTP: ${response.status}`);
  }

  return data;
}

// ==========================================
// PUBLIC API METHODS
// ==========================================
export const api = {
  // Public Data
  getProfile: () => request<{ success: boolean; data: any }>('/profile'),
  getProjects: () => request<{ success: boolean; data: any[] }>('/projects'),
  getSkills: () => request<{ success: boolean; data: any[] }>('/skills'),
  getEducation: () => request<{ success: boolean; data: any[] }>('/education'),
  getAchievements: () => request<{ success: boolean; data: any[] }>('/achievements'),
  submitContact: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Auth Methods
  login: (credentials: { username: string; password: string }) =>
    request<{ success: boolean; message: string; data: { token: string; user: any } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<{ success: boolean; data: any }>('/auth/me'),
  changePassword: (data: any) =>
    request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Admin Operations
  getAdminStats: () => request<{ success: boolean; data: any }>('/admin/stats'),
  updateProfile: (data: any) =>
    request<{ success: boolean; message: string }>('/admin/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Projects CRUD
  createProject: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/admin/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: number, data: any) =>
    request<{ success: boolean; message: string }>('/admin/projects/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: number) =>
    request<{ success: boolean; message: string }>('/admin/projects/' + id, {
      method: 'DELETE',
    }),

  // Skills CRUD
  createSkill: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/admin/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateSkill: (id: number, data: any) =>
    request<{ success: boolean; message: string }>('/admin/skills/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteSkill: (id: number) =>
    request<{ success: boolean; message: string }>('/admin/skills/' + id, {
      method: 'DELETE',
    }),

  // Education CRUD
  createEducation: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/admin/education', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEducation: (id: number, data: any) =>
    request<{ success: boolean; message: string }>('/admin/education/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteEducation: (id: number) =>
    request<{ success: boolean; message: string }>('/admin/education/' + id, {
      method: 'DELETE',
    }),

  // Achievements CRUD
  createAchievement: (data: any) =>
    request<{ success: boolean; message: string; data: any }>('/admin/achievements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAchievement: (id: number, data: any) =>
    request<{ success: boolean; message: string }>('/admin/achievements/' + id, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAchievement: (id: number) =>
    request<{ success: boolean; message: string }>('/admin/achievements/' + id, {
      method: 'DELETE',
    }),

  // Messages
  getMessages: () => request<{ success: boolean; data: any[] }>('/admin/messages'),
  markMessageRead: (id: number, is_read: boolean) =>
    request<{ success: boolean; message: string }>('/admin/messages/' + id + '/read', {
      method: 'PATCH',
      body: JSON.stringify({ is_read }),
    }),
  deleteMessage: (id: number) =>
    request<{ success: boolean; message: string }>('/admin/messages/' + id, {
      method: 'DELETE',
    }),
};
