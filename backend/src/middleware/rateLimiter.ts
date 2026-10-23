import rateLimit from 'express-rate-limit';

// Strict limiter for authentication attempts (15 attempts per 15 minutes)
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu đăng nhập từ địa chỉ IP này. Vui lòng thử lại sau 15 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiter (300 requests per 15 minutes per IP)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Hệ thống đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau giây lát.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact message limiter (5 messages per 10 minutes per IP)
export const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều tin nhắn. Vui lòng thử lại sau 10 phút.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
