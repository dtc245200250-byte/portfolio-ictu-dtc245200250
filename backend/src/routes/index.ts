import { Router } from 'express';
import { login, getMe, changePassword } from '../controllers/auth.controller.js';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skill.controller.js';
import {
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
} from '../controllers/education.controller.js';
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievement.controller.js';
import {
  submitContact,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} from '../controllers/contact.controller.js';
import { getStats } from '../controllers/stats.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { loginLimiter, contactLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// ==========================================
// 1. PUBLIC ROUTES (DÀNH CHO KHÁCH THĂM QUAN)
// ==========================================
router.get('/profile', getProfile);
router.get('/projects', getProjects);
router.get('/skills', getSkills);
router.get('/education', getEducation);
router.get('/achievements', getAchievements);
router.post('/contact', contactLimiter, submitContact);

// ==========================================
// 2. AUTHENTICATION ROUTES (XÁC THỰC ADMIN)
// ==========================================
router.post('/auth/login', loginLimiter, login);
router.get('/auth/me', authenticateToken as any, getMe as any);
router.post('/auth/change-password', authenticateToken as any, changePassword as any);

// ==========================================
// 3. PROTECTED ADMIN ROUTES (QUẢN TRỊ VIÊN)
// ==========================================
// Thống kê Dashboard
router.get('/admin/stats', authenticateToken as any, getStats);

// Quản lý Profile
router.put('/admin/profile', authenticateToken as any, updateProfile);

// Quản lý Dự án
router.post('/admin/projects', authenticateToken as any, createProject);
router.put('/admin/projects/:id', authenticateToken as any, updateProject);
router.delete('/admin/projects/:id', authenticateToken as any, deleteProject);

// Quản lý Kỹ năng
router.post('/admin/skills', authenticateToken as any, createSkill);
router.put('/admin/skills/:id', authenticateToken as any, updateSkill);
router.delete('/admin/skills/:id', authenticateToken as any, deleteSkill);

// Quản lý Học vấn
router.post('/admin/education', authenticateToken as any, createEducation);
router.put('/admin/education/:id', authenticateToken as any, updateEducation);
router.delete('/admin/education/:id', authenticateToken as any, deleteEducation);

// Quản lý Thành tích
router.post('/admin/achievements', authenticateToken as any, createAchievement);
router.put('/admin/achievements/:id', authenticateToken as any, updateAchievement);
router.delete('/admin/achievements/:id', authenticateToken as any, deleteAchievement);

// Quản lý Tin nhắn liên hệ
router.get('/admin/messages', authenticateToken as any, getContactMessages);
router.patch('/admin/messages/:id/read', authenticateToken as any, markMessageRead);
router.delete('/admin/messages/:id', authenticateToken as any, deleteContactMessage);

export default router;
