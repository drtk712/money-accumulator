# 简化的单阶段构建 - 支持多架构
FROM --platform=$TARGETPLATFORM nginx:alpine

# 设置构建参数
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 复制自定义nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 直接复制预构建的静态文件
COPY out/ /usr/share/nginx/html/

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 