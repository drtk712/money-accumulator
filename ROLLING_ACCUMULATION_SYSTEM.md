# 滚动累加系统设计文档

## 系统概述

全新设计的滚动累加系统，实现了精确的工资累加显示效果。系统根据每秒累加金额的大小，智能确定滚动范围，只对有意义的位数执行动画，提供更真实的累加体验。

## 核心设计原理

### 1. 每秒累加金额计算 (A)

```typescript
const incrementPerSecond = useMemo(() => {
  const workMinutesPerDay = (endHour - startHour) * 60 + (endMinute - startMinute);
  const workSecondsPerDay = workMinutesPerDay * 60;
  const dailySalary = monthlySalary / workDaysPerMonth;
  return dailySalary / workSecondsPerDay;
}, [config]);
```

**示例**：
- 月薪 ¥10,000，每月22天，每天8小时
- 每秒累加金额 A = 10000 ÷ 22 ÷ (8×3600) ≈ 0.0158 元/秒

### 2. 最大位数计算 (count)

使用 `getMaxDigitPosition()` 函数计算每秒累加金额的最大有效位数：

```typescript
export const getMaxDigitPosition = (value: number): number => {
  if (value === 0) return 0;
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1) {
    // 整数部分，返回正数
    return Math.floor(Math.log10(absValue)) + 1;
  } else {
    // 小数部分，返回负数
    const str = absValue.toString();
    const decimalIndex = str.indexOf('.');
    
    // 找到第一个非零数字的位置
    for (let i = decimalIndex + 1; i < str.length; i++) {
      if (str[i] !== '0') {
        return -(i - decimalIndex);
      }
    }
    return 0;
  }
};
```

**位数编码规则**：
- 正数表示整数位：1=个位，2=十位，3=百位...
- 负数表示小数位：-1=十分位，-2=百分位，-3=千分位...

**示例**：
- A = 2 → count = 1 (个位)
- A = 0.23 → count = -1 (十分位)
- A = 565.256 → count = 3 (百位)
- A = 0.00235 → count = -3 (千分位)

### 3. 滚动范围确定

只有 **count位到count-2位** 执行滚动动画：

```typescript
const rollingPositions: number[] = [];
for (let pos = maxDigitPosition; pos >= maxDigitPosition - 2; pos--) {
  rollingPositions.push(pos);
}
```

**示例**：
- A = 0.0158 → count = -2 → 滚动范围：[-2, -3, -4] (百分位、千分位、万分位)
- A = 2.35 → count = 1 → 滚动范围：[1, 0, -1] (个位、小数点、十分位)

### 4. 低位数字处理

count-3及以后的位数直接补9，不执行滚动动画：

```typescript
for (let i = 0; i < 5; i++) {
  const position = -(i + 1); // -1, -2, -3, -4, -5
  if (position < maxDigitPosition - 2) {
    // 这些位置直接补9
    finalDecimalPart = finalDecimalPart.substring(0, i) + '9' + finalDecimalPart.substring(i + 1);
  }
}
```

### 5. 固定小数位显示

总金额固定显示5位小数，确保显示精度：

```typescript
const formatted = convertedValue.toFixed(5);
const [integerPart, decimalPart = '00000'] = formatted.split('.');
const paddedDecimalPart = decimalPart.padEnd(5, '0');
```

## 技术实现

### 1. 智能滚动累加格式化器

```typescript
export const formatRollingCurrencyNumber = (
  value: number, 
  currency: string, 
  incrementPerSecond: number
): NumberFormatResult & { 
  rollingPositions: number[];
  maxDigitPosition: number;
  shouldRoll: (position: number) => boolean;
}
```

**功能**：
- 计算货币转换后的值和增量
- 确定滚动范围
- 格式化整数和小数部分
- 提供位置判断函数

### 2. 位置数字提取器

```typescript
export const getDigitAtPosition = (value: number, position: number): number => {
  if (position > 0) {
    // 整数位
    const divisor = Math.pow(10, position - 1);
    return Math.floor(value / divisor) % 10;
  } else if (position < 0) {
    // 小数位
    const multiplier = Math.pow(10, -position);
    return Math.floor((value * multiplier) % 10);
  }
  return 0;
};
```

**功能**：
- 从数字中提取指定位置的数字
- 支持正数位置（整数位）和负数位置（小数位）

### 3. 累加滚动组件

`RollingDigit` 组件实现了新的累加逻辑：

```typescript
// 累加增量
accumulatedValue.current += incrementPerSecond * deltaTime;

// 获取当前位置应该显示的数字
const targetDigit = getDigitAtPosition(accumulatedValue.current, position);
```

**特性**：
- 基于时间的累加计算
- 智能滚动方向选择
- 位置相关的动画延迟
- 不滚动位置的视觉区分

## 视觉效果设计

### 1. 滚动动画

- **滚动位置**：正常亮度，流畅动画
- **非滚动位置**：降低透明度至70%，静态显示
- **补9位置**：直接显示9，不执行动画

### 2. 动画参数

```typescript
// 根据位置计算延迟
const baseDelay = isDecimal ? currencyConfig.scrollDelay * 0.3 : currencyConfig.scrollDelay * 0.5;
const delayFromRight = Math.abs(position) * baseDelay;

// 动画速度
currencyConfig.animationSpeed * 0.8 // 稍快的动画
```

### 3. 调试信息

开发环境下显示调试信息：

```typescript
{process.env.NODE_ENV === 'development' && (
  <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
    <div>增量/秒: {incrementPerSecond.toFixed(6)}</div>
    <div>最大位数: {maxDigitPosition}</div>
    <div>滚动范围: {rollingPositions.join(', ')}</div>
  </div>
)}
```

## 实际效果示例

### 示例1：普通工资
- **配置**：月薪¥10,000，每天8小时，22天/月
- **每秒增量**：0.0158元/秒
- **最大位数**：-2 (百分位)
- **滚动范围**：[-2, -3, -4] (百分位、千分位、万分位)
- **显示效果**：¥123.45**678**，粗体部分滚动，第5位补9

### 示例2：高薪工资
- **配置**：月薪¥50,000，每天8小时，22天/月
- **每秒增量**：0.0789元/秒
- **最大位数**：-1 (十分位)
- **滚动范围**：[-1, -2, -3] (十分位、百分位、千分位)
- **显示效果**：¥1234.**567**89，粗体部分滚动，最后两位补9

### 示例3：津巴布韦币
- **配置**：月薪¥10,000转换为津巴布韦币
- **每秒增量**：约711,000 Z$/秒
- **最大位数**：6 (十万位)
- **滚动范围**：[6, 5, 4] (十万位、万位、千位)
- **显示效果**：Z$12,**345**,678.99999，粗体部分滚动

## 性能优化

### 1. 时间管理
- 使用 `useRef` 存储累加值和时间戳
- 避免频繁的状态更新
- 限制最大动画延迟

### 2. 内存优化
- 智能的滚动判断减少不必要的动画
- 优化的样式计算
- 合理的组件更新频率

### 3. 用户体验
- 平滑的货币切换过渡
- 响应式字体大小
- 智能的视觉层次

## 总结

新的滚动累加系统实现了：

1. **精确的累加逻辑**：基于实际每秒增量计算
2. **智能的滚动范围**：只对有意义的位数执行动画
3. **优雅的视觉效果**：区分滚动和非滚动位置
4. **高性能实现**：优化的时间和内存管理
5. **灵活的配置**：支持多种货币和工资配置

这个系统为用户提供了更真实、更精确的工资累加体验，特别是对于不同汇率的货币都能提供合适的显示效果。 