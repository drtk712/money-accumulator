# 🐳 Docker部署指南

## 📋 简化部署流程

本项目采用简化的Docker部署方案，只需要一个Dockerfile即可完成部署。

## 🚀 快速开始

### 前提条件
- 已安装Docker
- 已安装Node.js和npm

### 部署步骤

```bash
# 1. 克隆项目
git clone git@github.com:drtk712/money-accumulator.git
cd money-accumulator

# 2. 安装依赖
npm install

# 3. 构建Next.js应用
npm run build

# 4. 构建Docker镜像
docker build -t money-accumulator .

# 5. 运行容器
docker run -d -p 3000:80 --name money-accumulator money-accumulator

# 6. 访问应用
open http://localhost:3000
```

## 🔧 Dockerfile说明

```dockerfile
# 基于轻量级nginx镜像 - 支持多架构
FROM --platform=$TARGETPLATFORM nginx:alpine

# 设置构建参数
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# 复制nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 复制预构建的静态文件
COPY out/ /usr/share/nginx/html/

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
```

## 🏥 健康检查

```bash
# 检查容器状态
docker ps

# 检查应用健康
curl http://localhost:3000/health
# 预期响应: healthy

# 查看容器日志
docker logs money-accumulator
```

## 🔧 常用命令

```bash
# 停止容器
docker stop money-accumulator

# 删除容器
docker rm money-accumulator

# 删除镜像
docker rmi money-accumulator

# 重新构建并运行
npm run build && docker build -t money-accumulator . && docker run -d -p 3000:80 --name money-accumulator money-accumulator
```

## 🏗️ 多架构构建

### 支持的架构
- **linux/amd64** - Intel/AMD 64位处理器
- **linux/arm64** - ARM 64位处理器 (Apple Silicon, ARM服务器)

### 单架构构建（推荐）
```bash
# 自动检测当前架构
docker build -t money-accumulator .

# 指定架构构建
docker build --platform linux/amd64 -t money-accumulator .
docker build --platform linux/arm64 -t money-accumulator .
```

### 多架构构建（需要Docker Buildx）
```bash
# 创建buildx构建器
docker buildx create --name multiarch --use

# 构建多架构镜像（本地测试）
docker buildx build --platform linux/amd64,linux/arm64 -t money-accumulator .

# 构建并推送到Docker Hub
docker buildx build --platform linux/amd64,linux/arm64 -t username/money-accumulator:latest --push .
```

## 🌐 生产部署

### 推送到Docker Hub
```bash
# 单架构推送
docker tag money-accumulator username/money-accumulator:latest
docker push username/money-accumulator:latest

# 多架构推送（推荐）
docker buildx build --platform linux/amd64,linux/arm64 -t username/money-accumulator:latest --push .
```

### 在服务器上部署
```bash
# 拉取镜像（自动选择匹配架构）
docker pull username/money-accumulator:latest

# 运行容器
docker run -d -p 80:80 --name money-accumulator --restart unless-stopped username/money-accumulator:latest
```

## 📊 优势

- **简单**: 只需一个Dockerfile
- **轻量**: 基于alpine镜像，体积小
- **快速**: 无需在容器内构建，直接复制静态文件
- **稳定**: nginx提供高性能静态文件服务
- **安全**: 内置安全头配置
- **兼容**: 支持多CPU架构，适配不同硬件平台

## 🐛 故障排除

### 构建失败
- 确保已执行 `npm run build`
- 检查 `out/` 目录是否存在且不为空

### 架构相关问题
```bash
# 检查当前系统架构
uname -m
# arm64 = Apple Silicon Mac
# x86_64 = Intel/AMD Mac/PC

# 检查Docker镜像架构
docker inspect money-accumulator | grep Architecture

# 强制指定架构构建
docker build --platform linux/$(uname -m) -t money-accumulator .
```

### 多架构构建问题
```bash
# 检查buildx是否可用
docker buildx version

# 创建新的构建器
docker buildx create --name multiarch --use --bootstrap

# 查看支持的平台
docker buildx inspect --bootstrap
```

### 端口冲突
```bash
# 查看端口占用
lsof -i :3000

# 使用其他端口
docker run -d -p 8080:80 --name money-accumulator money-accumulator
```

### 权限问题
```bash
# 确保Docker有权限访问文件
sudo chown -R $USER:$USER .
```

---

**简单、快速、可靠的Docker部署方案！** 🚀🐳 