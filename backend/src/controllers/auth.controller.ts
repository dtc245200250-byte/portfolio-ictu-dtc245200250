import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';

export async function login(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' });
    return;
  }

  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT id, username, password_hash, full_name, email, role FROM admins WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      logger.warn(`Failed login attempt for non-existent user: ${username} from IP: ${req.ip}`);
      res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
      return;
    }

    const admin = rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      logger.warn(`Failed login attempt (invalid password) for user: ${username} from IP: ${req.ip}`);
      res.status(401).json({ success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'ICTU_DTC245200250_SecretTokenKey2026FullStackDev!';
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      secret,
      { expiresIn: expiresIn as any }
    );

    logger.info(`Admin successfully authenticated: ${username} (ID: ${admin.id}) from IP: ${req.ip}`);

    res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: {
        token,
        user: {
          id: admin.id,
          username: admin.username,
          fullName: admin.full_name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error: any) {
    logger.error('Error during login authentication:', { error: error.message });
    res.status(500).json({ success: false, message: 'Lỗi xác thực hệ thống.' });
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Chưa đăng nhập.' });
    return;
  }

  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT id, username, full_name, email, role, created_at FROM admins WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Không tìm thấy thông tin quản trị viên.' });
      return;
    }

    res.json({ success: true, data: rows[0] });
  } catch (error: any) {
    logger.error('Error in getMe:', { error: error.message });
    res.status(500).json({ success: false, message: 'Không thể lấy thông tin người dùng.' });
  }
}

export async function changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Chưa xác thực.' });
    return;
  }

  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 8) {
    res.status(400).json({
      success: false,
      message: 'Mật khẩu mới phải có tối thiểu 8 ký tự và đầy đủ thông tin hiện tại.',
    });
    return;
  }

  try {
    const [rows]: [any[], any] = await pool.query(
      'SELECT password_hash FROM admins WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0) {
      res.status(404).json({ success: false, message: 'Người dùng không tồn tại.' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Mật khẩu hiện tại không chính xác.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await pool.query('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
    logger.info(`Admin password changed for ID: ${req.user.id}`);

    res.json({ success: true, message: 'Đổi mật khẩu thành công.' });
  } catch (error: any) {
    logger.error('Error changing password:', { error: error.message });
    res.status(500).json({ success: false, message: 'Không thể cập nhật mật khẩu.' });
  }
}
