import { Request, Response } from 'express';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';

export async function getProfile(req: Request, res: Response): Promise<void> {
  try {
    const [rows]: [any[], any] = await pool.query('SELECT * FROM profile ORDER BY id ASC LIMIT 1');
    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Chưa có thông tin hồ sơ.' });
      return;
    }
    res.json({ success: true, data: rows[0] });
  } catch (error: any) {
    logger.error('Error fetching profile:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi truy vấn hồ sơ cá nhân.' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  const {
    full_name,
    student_id,
    class_name,
    major,
    university,
    faculty,
    title,
    bio,
    email,
    phone,
    location,
    avatar_url,
    github_url,
    linkedin_url,
    facebook_url,
    cv_url,
  } = req.body;

  if (!full_name || !student_id || !class_name) {
    res.status(400).json({ success: false, message: 'Họ tên, mã sinh viên và lớp không được để trống.' });
    return;
  }

  try {
    const [existing]: [any[], any] = await pool.query('SELECT id FROM profile ORDER BY id ASC LIMIT 1');

    if (existing.length === 0) {
      await pool.query(
        `INSERT INTO profile (
          full_name, student_id, class_name, major, university, faculty,
          title, bio, email, phone, location, avatar_url, github_url, linkedin_url, facebook_url, cv_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          full_name, student_id, class_name, major, university, faculty,
          title, bio, email, phone, location, avatar_url, github_url, linkedin_url, facebook_url, cv_url
        ]
      );
    } else {
      await pool.query(
        `UPDATE profile SET
          full_name = ?, student_id = ?, class_name = ?, major = ?, university = ?, faculty = ?,
          title = ?, bio = ?, email = ?, phone = ?, location = ?, avatar_url = ?, github_url = ?,
          linkedin_url = ?, facebook_url = ?, cv_url = ?
        WHERE id = ?`,
        [
          full_name, student_id, class_name, major, university, faculty,
          title, bio, email, phone, location, avatar_url, github_url, linkedin_url, facebook_url, cv_url,
          existing[0].id
        ]
      );
    }

    logger.info('Profile updated successfully by admin');
    res.json({ success: true, message: 'Cập nhật thông tin cá nhân thành công.' });
  } catch (error: any) {
    logger.error('Error updating profile:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi cập nhật hồ sơ cá nhân.' });
  }
}
