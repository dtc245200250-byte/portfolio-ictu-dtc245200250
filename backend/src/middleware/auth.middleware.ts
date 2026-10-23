import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Yêu cầu xác thực: Token không được cung cấp' });
    return;
  }

  const secret = process.env.JWT_SECRET || 'ICTU_DTC245200250_SecretTokenKey2026FullStackDev!';

  try {
    const decoded = jwt.verify(token, secret) as any;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    next();
  } catch (err: any) {
    logger.warn('Token validation failed', { error: err.message, ip: req.ip });
    res.status(403).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
}
