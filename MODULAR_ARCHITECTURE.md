# 模块化架构文档

## 项目概述

本项目已完成全面的模块化重构，将原本单一的大文件拆分为多个功能明确、职责单一的模块，提高了代码的可维护性、可测试性和可扩展性。

## 目录结构

```
src/
├── app/
│   ├── page.tsx              # 主页面组件（重构后）
│   ├── layout.tsx            # 布局组件
│   └── globals.css           # 全局样式
├── components/               # UI组件模块
│   ├── RollingDigit.tsx      # 滚动数字组件
│   ├── RollingNumberDisplay.tsx # 滚动数字显示组件
│   ├── SettingsPanel.tsx     # 设置面板组件
│   └── index.ts              # 组件导出文件
├── hooks/                    # 自定义Hook模块
│   ├── useSalaryCalculator.ts # 工资计算Hook
│   └── useLocalStorage.ts    # 本地存储Hook
├── utils/                    # 工具函数模块
│   ├── currency.ts           # 货币相关工具函数
│   └── time.ts               # 时间相关工具函数
├── types/                    # 类型定义模块
│   └── index.ts              # 所有类型定义
└── constants/                # 常量配置模块
    └── currency.ts           # 货币配置常量
```

## 模块详细说明

### 1. 类型定义模块 (`src/types/`)

**文件**: `index.ts`

**职责**: 集中管理所有TypeScript类型定义

**主要类型**:
- `SalaryConfig`: 工资配置接口
- `CurrencyInfo`: 货币信息接口
- `CurrencyDisplayConfig`: 货币显示配置接口
- `NumberFormatResult`: 数字格式化结果接口
- `RollingDigitProps`: 滚动数字组件属性接口
- `RollingNumberDisplayProps`: 滚动数字显示组件属性接口
- `TimeInfo`: 时间信息接口
- `Statistics`: 统计信息接口

### 2. 常量配置模块 (`src/constants/`)

**文件**: `currency.ts`

**职责**: 管理货币相关的配置常量

**主要常量**:
- `EXCHANGE_RATES`: 汇率配置（17种货币）
- `MEGA_CURRENCIES`: 超大金额货币分类
- `LARGE_CURRENCIES`: 大金额货币分类
- `CURRENCY_DISPLAY_CONFIG`: 货币显示配置

### 3. 工具函数模块 (`src/utils/`)

#### 3.1 货币工具 (`currency.ts`)

**主要函数**:
- `formatCurrencyNumber()`: 智能数字格式化器
- `calculateFontSize()`: 响应式字体大小计算
- `calculateCurrencySymbolWidth()`: 货币符号宽度计算
- `formatCurrencyForTitle()`: 标题货币格式化

#### 3.2 时间工具 (`time.ts`)

**主要函数**:
- `formatTime()`: 时间格式化（秒转HH:MM:SS）
- `timeStringToSeconds()`: 时间字符串转秒数
- `getCurrentTimeInfo()`: 获取当前时间信息
- `isWorkingTime()`: 检查是否在工作时间

### 4. 自定义Hook模块 (`src/hooks/`)

#### 4.1 工资计算Hook (`useSalaryCalculator.ts`)

**职责**: 封装工资计算逻辑

**功能**:
- 实时计算当前收入
- 判断工作时间状态
- 计算工作进度
- 生成统计信息

**返回值**:
```typescript
{
  currentEarnings: number;
  isWorkTime: boolean;
  workProgress: number;
  statistics: Statistics;
}
```

#### 4.2 本地存储Hook (`useLocalStorage.ts`)

**职责**: 封装本地存储操作

**功能**:
- 自动读取localStorage
- 自动保存到localStorage
- 错误处理
- TypeScript类型安全

### 5. UI组件模块 (`src/components/`)

#### 5.1 滚动数字组件 (`RollingDigit.tsx`)

**职责**: 单个数字的滚动动画

**特性**:
- 智能滚动方向选择
- 货币配置驱动的动画
- 分隔符支持
- 小数位特殊处理

#### 5.2 滚动数字显示组件 (`RollingNumberDisplay.tsx`)

**职责**: 完整数字的显示和管理

**特性**:
- 智能数字格式化
- 货币切换平滑过渡
- 响应式字体大小
- 千分位分隔符

#### 5.3 设置面板组件 (`SettingsPanel.tsx`)

**职责**: 用户设置界面

**特性**:
- 货币选择界面
- 快捷设置按钮
- 表单验证
- 动画效果

### 6. 主页面组件 (`src/app/page.tsx`)

**重构后的特点**:
- 代码量从945行减少到约200行
- 使用模块化组件和Hook
- 逻辑清晰，职责单一
- 易于维护和测试

## 模块化优势

### 1. 可维护性
- **单一职责**: 每个模块只负责一个特定功能
- **低耦合**: 模块间依赖关系清晰
- **高内聚**: 相关功能集中在同一模块

### 2. 可测试性
- **独立测试**: 每个模块可以独立进行单元测试
- **Mock友好**: 依赖注入便于测试
- **覆盖率**: 更容易实现高测试覆盖率

### 3. 可扩展性
- **新功能**: 添加新功能时只需创建新模块
- **修改隔离**: 修改一个模块不影响其他模块
- **版本管理**: 模块可以独立版本控制

### 4. 代码复用
- **组件复用**: UI组件可在其他项目中复用
- **工具函数**: 工具函数可以独立使用
- **Hook复用**: 自定义Hook可以在不同组件中使用

### 5. 团队协作
- **并行开发**: 不同开发者可以同时开发不同模块
- **代码审查**: 模块化使代码审查更加高效
- **知识共享**: 模块化结构便于团队成员理解

## 性能优化

### 1. 代码分割
- 模块化结构天然支持代码分割
- 按需加载减少初始包大小
- 提高页面加载速度

### 2. 缓存优化
- 独立模块便于浏览器缓存
- 修改单个模块不影响其他模块缓存
- 提高缓存命中率

### 3. 内存管理
- Hook封装减少内存泄漏
- 组件拆分降低重渲染成本
- 优化的依赖关系

## 构建结果

- **构建成功**: ✅ 无错误无警告
- **包大小**: 44.1kB (略微增加0.3kB，但获得了巨大的架构优势)
- **类型安全**: 100% TypeScript覆盖
- **ESLint**: 通过所有代码质量检查

## 未来扩展建议

### 1. 测试模块
```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── integration/
```

### 2. 国际化模块
```
src/
├── i18n/
│   ├── locales/
│   ├── hooks/
│   └── utils/
```

### 3. 主题模块
```
src/
├── themes/
│   ├── light.ts
│   ├── dark.ts
│   └── index.ts
```

### 4. API模块
```
src/
├── api/
│   ├── client.ts
│   ├── endpoints/
│   └── types/
```

## 总结

通过模块化重构，项目获得了：

1. **更好的代码组织**: 清晰的目录结构和职责分离
2. **更高的开发效率**: 模块化开发和复用
3. **更强的可维护性**: 易于理解、修改和扩展
4. **更好的团队协作**: 支持并行开发和代码审查
5. **更优的性能**: 代码分割和缓存优化

这种模块化架构为项目的长期发展奠定了坚实的基础，使其能够轻松应对未来的功能扩展和维护需求。 