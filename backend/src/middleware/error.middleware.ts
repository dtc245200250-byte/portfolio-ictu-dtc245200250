import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Lỗi máy chủ nội bộ. Vui lòng liên hệ quản trị viên.';

  // Log full error details internally for troubleshooting and Loki collection
  logger.error('Unhandled Application Error:', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });

  // Never leak internal stack trace to client
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu. Vui lòng thử lại sau.'
      : message,
  });
}
