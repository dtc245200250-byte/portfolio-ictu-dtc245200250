import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes/index.js';
import { testDbConnection } from './config/database.js';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/error.middleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ==========================================
// BẢO MẬT & HARDENING MIDDLEWARE
// ==========================================
// 1. Helmet thiết lập các HTTP headers an toàn
app.use(
  helmet({
    contentSecurityPolicy: false, // Quản lý bởi Nginx reverse proxy
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS giới hạn nguồn truy cập
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080,https://localhost:8443,http://localhost:3000').split(',');
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (ví dụ curl hoặc nội bộ server-to-server) hoặc khớp danh sách
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o.trim()))) {
        callback(null, true);
      } else {
        callback(new Error('Chặn bởi chính sách CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Giới hạn dung lượng payload (chống flood memory)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 4. Rate Limiter chung cho API
app.use('/api/', apiLimiter);

// 5. Logging middleware cho mọi request (hỗ trợ Promtail / Loki)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress,
      userAgent: req.get('user-agent'),
    };
    if (res.statusCode >= 500) {
      logger.error(`API Error ${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(`API Client Warning ${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
    } else {
      logger.info(`API Request ${req.method} ${req.originalUrl} - ${res.statusCode}`, logData);
    }
  });
  next();
});

// ==========================================
// HEALTHCHECK VÀ API ROUTES
// ==========================================
// Health endpoint cho Docker healthcheck và Monitoring
const healthHandler = (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'portfolio-backend',
    version: '1.0.0',
    student: 'Phan Quang Tung - DTC245200250',
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);

// Prometheus Metrics endpoint
app.get('/metrics', (req: Request, res: Response) => {
  const mem = process.memoryUsage();
  res.set('Content-Type', 'text/plain; version=0.0.4');
  res.send(
`# HELP process_uptime_seconds The process uptime in seconds
# TYPE process_uptime_seconds gauge
process_uptime_seconds ${process.uptime().toFixed(2)}

# HELP process_memory_rss_bytes Resident set size in bytes
# TYPE process_memory_rss_bytes gauge
process_memory_rss_bytes ${mem.rss}

# HELP process_memory_heap_used_bytes Heap memory used in bytes
# TYPE process_memory_heap_used_bytes gauge
process_memory_heap_used_bytes ${mem.heapUsed}

# HELP portfolio_backend_status Service health status (1=healthy)
# TYPE portfolio_backend_status gauge
portfolio_backend_status 1
`
  );
});

// Mount các API routes
app.use('/api', routes);

// 404 handler cho các endpoint không tồn tại
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler (không làm lộ stack trace)
app.use(errorHandler);

// ==========================================
// KHỞI ĐỘNG MÁY CHỦ
// ==========================================
async function startServer(): Promise<void> {
  logger.info('Đang kiểm tra kết nối tới MySQL Database...');
  const isDbReady = await testDbConnection(20, 3000);

  if (!isDbReady) {
    logger.error('Không thể kết nối đến cơ sở dữ liệu sau nhiều lần thử. Server tạm dừng.');
    process.exit(1);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`====================================================`);
    logger.info(`Portfolio Backend API đang chạy tại cổng ${PORT}`);
    logger.info(`Môi trường: ${process.env.NODE_ENV || 'production'}`);
    logger.info(`Sinh viên: Phan Quang Tùng (MSSV: DTC245200250)`);
    logger.info(`Healthcheck: http://localhost:${PORT}/health`);
    logger.info(`====================================================`);
  });

  // Graceful Shutdown
  const handleShutdown = (signal: string) => {
    logger.info(`Nhận tín hiệu ${signal}. Đang đóng kết nối an toàn...`);
    server.close(() => {
      logger.info('Máy chủ Backend đã dừng.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch((err) => {
  logger.error('Lỗi nghiêm trọng khi khởi động máy chủ:', { error: err.message });
  process.exit(1);
});
