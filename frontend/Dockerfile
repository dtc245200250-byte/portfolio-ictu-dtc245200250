# ==============================================================================
# GIAI ĐOẠN 1: BUILD REACT + VITE
# ==============================================================================
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

COPY tsconfig*.json vite.config.ts index.html ./
COPY src/ ./src/

RUN npm run build

# ==============================================================================
# GIAI ĐOẠN 2: RUNTIME NGINX SERVING STATIC BUNDLE (HARDENING)
# ==============================================================================
FROM nginx:1.27-alpine AS runner

# Xóa trang mặc định của Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copy cấu hình Nginx tối ưu cho SPA
COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf

# Copy bản build static từ giai đoạn 1
COPY --from=builder /app/dist /usr/share/nginx/html

# Phân quyền cho người dùng nginx
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid /var/cache/nginx

EXPOSE 80

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
