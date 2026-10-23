# ==============================================================================
# GIAI ĐOẠN 1: BUILD SOURCE TS -> JS
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json tsconfig.json ./

# Cài đặt tất cả dependencies (bao gồm devDependencies để biên dịch TS)
RUN npm ci || npm install

# Copy toàn bộ mã nguồn
COPY src/ ./src/

# Biên dịch TypeScript sang JavaScript
RUN npm run build

# ==============================================================================
# GIAI ĐOẠN 2: RUNTIME PRODUCTION HOÀN THIỆN (HARDENING NON-ROOT)
# ==============================================================================
FROM node:22-alpine AS runner

WORKDIR /app

# Thiết lập biến môi trường
ENV NODE_ENV=production
ENV PORT=5000

# Tạo nhóm và người dùng non-root (Bảo mật: Hardening tiêu chí 6)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Tạo thư mục log chia sẻ với quyền sở hữu của nodejs user
RUN mkdir -p /var/log/app && chown -R nodejs:nodejs /var/log/app

# Copy package manifests và chỉ cài đặt production dependencies
COPY package*.json ./
RUN (npm ci --only=production || npm install --only=production) && npm cache clean --force

# Copy mã nguồn đã biên dịch từ builder stage
COPY --from=builder /app/dist ./dist

# Phân quyền chặt chẽ cho thư mục ứng dụng
RUN chown -R nodejs:nodejs /app

# Chuyển sang người dùng non-root
USER nodejs

# Expose cổng 5000 nội bộ
EXPOSE 5000

# Healthcheck nội bộ cho Docker Compose
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:5000/health > /dev/null || exit 1

# Lệnh khởi chạy ứng dụng
CMD ["node", "dist/server.js"]
