# 💰 财富累积计算器 - Money Accumulator

一个让您实时感受财富增长的应用！输入您的工资信息，看着您的收入每秒钟都在增长！

## ✨ 功能特色

### 💵 核心功能
- **实时收入计算**: 根据您的月工资和工作时间，实时显示当前已赚取的金额
- **每秒累加**: 看着您的财富每秒钟都在增长，给您满满的成就感
- **智能工作时间**: 自动识别工作日和工作时间，非工作时间显示当日累积收入
- **本地存储**: 自动保存您的设置，下次打开无需重新配置

### 🌍 多货币支持
支持9种货币和商品换算（基于2024年真实汇率）：
- 💰 人民币 (CNY) - 基准货币
- 💵 美元 (USD) - 汇率: 0.139
- 💴 日元 (JPY) - 汇率: 19.8
- 💶 欧元 (EUR) - 汇率: 0.122
- 💷 英镑 (GBP) - 汇率: 0.103
- 💸 津巴布韦币 (ZWL) - 汇率: 36,100,000
- ₿ 比特币 (BTC) - 汇率: 0.00000129
- 🥇 黄金 (GOLD) - 汇率: 0.00134 (克)
- 🛢️ 石油 (OIL) - 汇率: 0.00193 (桶)

### 🎨 用户体验
- **豪华界面**: 金光闪闪的界面设计，让您感受财从八方来的气势
- **动画效果**: 金钱雨、闪烁效果、数字滚动等丰富动画
- **响应式设计**: 支持手机、平板、电脑等各种设备
- **等宽数字**: 专业级数字显示，无跳动，类似金融应用
- **标题栏显示**: 实时在浏览器标题栏显示收入状态

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 yarn

### 安装步骤

1. **克隆项目**：
```bash
git clone git@github.com:drtk712/money-accumulator.git
cd hello-work
```

2. **安装依赖**：
```bash
npm install
```

3. **启动开发服务器**：
```bash
npm run dev
```

4. **打开浏览器**访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本
```bash
npm run build
```

### 导出静态文件（纯客户端）
```bash
npm run export
```
生成的静态文件在 `out/` 目录中，可以直接部署到任何静态文件服务器。

### Docker部署

#### 快速开始
```bash
# 1. 构建Next.js应用
npm run build

# 2. 构建Docker镜像（自动适配当前架构）
docker build -t money-accumulator .

# 3. 运行容器
docker run -d -p 3000:80 --name money-accumulator money-accumulator
```

#### 多架构支持
```bash
# 指定架构构建
docker build --platform linux/amd64 -t money-accumulator .
docker build --platform linux/arm64 -t money-accumulator .

# 多架构构建（需要Docker Buildx）
docker buildx build --platform linux/amd64,linux/arm64 -t money-accumulator .
```

#### 访问应用
- 应用地址: http://localhost:3000
- 健康检查: http://localhost:3000/health

📖 **详细部署指南**: 查看 [DOCKER.md](DOCKER.md)

## 💡 使用指南

### 基本设置
1. **输入月工资**: 设置您的月工资金额（元）
2. **工作天数**: 设置每月工作天数（通常为22天）
3. **工作时间**: 设置上班和下班时间
4. **选择货币**: 点击货币按钮切换显示方式

### 功能说明
- **工作时间内**: 显示从今日上班开始的实时累积收入
- **非工作时间**: 显示当日总累积收入
- **周末**: 显示为非工作时间状态
- **设置保存**: 所有设置自动保存到本地存储

### 统计信息
应用会显示以下统计数据：
- ⚡ **每秒收入**: 精确到小数点后6位
- 📅 **日收入**: 每日总收入
- ⏰ **小时收入**: 每小时收入

## 🛠 技术栈

### 前端框架
- **Next.js 15.3.2**: React全栈框架
- **React 18**: 用户界面库
- **TypeScript**: 类型安全的JavaScript

### 样式和动画
- **Tailwind CSS**: 实用优先的CSS框架
- **Framer Motion**: 强大的动画库
- **自定义CSS**: 金色主题和特效

### 开发工具
- **ESLint**: 代码质量检查
- **PostCSS**: CSS处理工具
- **Git**: 版本控制

## 📁 项目结构

```
hello-work/
├── src/
│   ├── app/
│   │   ├── globals.css      # 全局样式和动画
│   │   ├── layout.tsx       # 应用布局
│   │   └── page.tsx         # 主页面组件
├── public/                  # 静态资源
├── out/                     # 构建输出目录
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript配置
├── tailwind.config.ts      # Tailwind配置
├── next.config.ts          # Next.js配置
├── Dockerfile              # Docker配置
├── nginx.conf              # Nginx配置
├── .dockerignore           # Docker忽略文件
├── DOCKER.md               # Docker部署指南
└── README.md               # 项目文档
```

## 🔧 核心技术实现

### 实时计算算法
```typescript
// 每秒收入计算
const calculatePerSecondEarning = () => {
  const workHours = calculateWorkHours(startTime, endTime);
  const dailyEarning = monthlySalary / workDaysPerMonth;
  const hourlyEarning = dailyEarning / workHours;
  return hourlyEarning / 3600; // 转换为每秒
};
```

### 工作时间判断
```typescript
// 智能工作时间检测
const isWorkingTime = () => {
  const now = new Date();
  const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
  const isInWorkHours = /* 时间范围检查 */;
  return isWeekday && isInWorkHours;
};
```

### 数字显示优化
- 使用等宽字体防止数字跳动
- 应用 `font-variant-numeric: tabular-nums`
- 优化字符间距提供专业显示效果

### Docker部署
- 基于nginx:alpine的轻量级镜像
- 直接复制预构建的静态文件
- 内置健康检查和安全配置
- 支持多CPU架构（AMD64/ARM64）

## 🎯 特色功能详解

### 1. 纯客户端应用
- 完全静态化，无需服务器
- 可部署到任何静态文件服务器（GitHub Pages、Netlify、Vercel等）
- 所有数据处理都在浏览器中完成

### 2. 汇率系统
- 基于2024年真实汇率数据
- 特殊商品（比特币、石油）采用美元转人民币的计算方式
- 支持不同精度的数字格式化

### 3. 本地存储
- 自动保存用户设置
- 支持设置恢复和数据持久化
- 错误处理确保存储失败时的应用稳定性

### 4. 响应式设计
- 移动端优化的触控体验
- 自适应布局适配不同屏幕尺寸
- 优化的字体大小和间距

## 🐛 已知问题和解决方案

### 构建优化
- ✅ 修复了所有ESLint错误和警告
- ✅ 解决了TypeScript类型安全问题
- ✅ 优化了React Hooks依赖项
- ✅ 清理了未使用的导入和变量

### 性能优化
- ✅ 使用useCallback优化函数性能
- ✅ 合理的useEffect依赖管理
- ✅ 避免不必要的重新渲染

## 🚀 部署指南

### 静态部署
1. **构建项目**: `npm run build`
2. **获取文件**: `out/` 目录中的所有文件
3. **上传部署**: 上传到任何静态文件服务器
4. **访问应用**: 通过域名直接访问

### Docker部署
1. **克隆项目**: `git clone git@github.com:drtk712/money-accumulator.git`
2. **进入目录**: `cd money-accumulator`
3. **构建应用**: `npm run build`
4. **构建镜像**: `docker build -t money-accumulator .`
5. **运行容器**: `docker run -d -p 3000:80 money-accumulator`
6. **访问应用**: http://localhost:3000

### 云平台部署
- **Vercel**: 连接GitHub仓库自动部署
- **Netlify**: 拖拽 `out/` 目录部署
- **GitHub Pages**: 上传静态文件到gh-pages分支
- **Docker Hub**: 推送镜像到容器注册表

## 🔄 更新日志

### v1.0.0 (2025-05-27)
- ✅ 完成核心功能开发
- ✅ 实现多货币支持
- ✅ 添加实时计算功能
- ✅ 修复水合错误
- ✅ 优化数字显示效果
- ✅ 完善错误处理和类型安全
- ✅ 简化Docker部署流程
- ✅ 优化为纯客户端应用

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 保持代码简洁和可读性

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🎉 致谢

感谢所有为这个项目做出贡献的开发者！

---

**让财富的增长变得可视化，让每一秒都充满价值！** 💎✨

*享受看着财富增长的快感，体验金钱的魅力！* 🤑💰 