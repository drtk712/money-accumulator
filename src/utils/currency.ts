import { EXCHANGE_RATES, CURRENCY_DISPLAY_CONFIG, MEGA_CURRENCIES, LARGE_CURRENCIES } from '../constants/currency';
import { NumberFormatResult } from '../types';

/**
 * 计算数字的最大有效位数count
 * 整数位为正数，小数位为负数
 * 例如：2 → 1, 0.23 → -1, 565.256 → 3, 0.00235 → -3
 */
export const getMaxDigitPosition = (value: number): number => {
  // 处理边界情况
  if (value === 0 || !isFinite(value) || isNaN(value)) return 0;
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1) {
    // 整数部分，返回正数
    // 处理极大数值的情况
    if (absValue >= Number.MAX_SAFE_INTEGER) {
      return Math.floor(Math.log10(Number.MAX_SAFE_INTEGER)) + 1;
    }
    return Math.floor(Math.log10(absValue)) + 1;
  } else {
    // 小数部分，返回负数
    // 使用字符串处理避免科学计数法问题
    const str = absValue.toString();
    
    // 处理科学计数法
    if (str.includes('e-')) {
      const [mantissa, exponent] = str.split('e-');
      const exp = parseInt(exponent);
      const mantissaDecimal = mantissa.includes('.') ? mantissa.split('.')[1] : '';
      const firstNonZeroPos = exp + (mantissaDecimal.length > 0 ? mantissaDecimal.search(/[1-9]/) + 1 : 1);
      return -firstNonZeroPos;
    }
    
    const decimalIndex = str.indexOf('.');
    if (decimalIndex === -1) return 0;
    
    // 找到第一个非零数字的位置
    for (let i = decimalIndex + 1; i < str.length; i++) {
      if (str[i] !== '0') {
        return -(i - decimalIndex);
      }
    }
    return 0;
  }
};

/**
 * 获取数字指定位置的数字
 * position: 正数表示整数位（1=个位，2=十位），负数表示小数位（-1=十分位，-2=百分位）
 */
export const getDigitAtPosition = (value: number, position: number): number => {
  // 处理边界情况
  if (!isFinite(value) || isNaN(value)) return 0;
  
  if (position > 0) {
    // 整数位
    const divisor = Math.pow(10, position - 1);
    return Math.floor(Math.abs(value) / divisor) % 10;
  } else if (position < 0) {
    // 小数位 - 使用字符串处理避免浮点数精度问题
    const absValue = Math.abs(value);
    const str = absValue.toFixed(Math.abs(position) + 2); // 多保留2位确保精度
    const decimalIndex = str.indexOf('.');
    const targetIndex = decimalIndex - position; // position是负数，所以用减法
    
    if (targetIndex >= 0 && targetIndex < str.length) {
      const digit = parseInt(str[targetIndex]);
      return isNaN(digit) ? 0 : digit;
    }
    return 0;
  }
  return 0;
};

/**
 * 智能滚动累加格式化器
 */
export const formatRollingCurrencyNumber = (
  value: number, 
  currency: string, 
  incrementPerSecondCNY: number
): NumberFormatResult & { 
  rollingPositions: number[];
  maxDigitPosition: number;
  shouldRoll: (position: number) => boolean;
} => {
  // 输入验证
  if (!isFinite(value) || isNaN(value)) value = 0;
  if (!isFinite(incrementPerSecondCNY) || isNaN(incrementPerSecondCNY)) incrementPerSecondCNY = 0;
  
  const currencyInfo = EXCHANGE_RATES[currency] || EXCHANGE_RATES.CNY;
  const currencyConfig = CURRENCY_DISPLAY_CONFIG[currency] || CURRENCY_DISPLAY_CONFIG.default;
  
  const convertedValue = value * currencyInfo.rate;
  const convertedIncrement = incrementPerSecondCNY * currencyInfo.rate;
  
  // 计算每秒累计金额的最大位数count
  const maxDigitPosition = getMaxDigitPosition(convertedIncrement);
  
  // 确定滚动范围：count位到count-2位
  const rollingPositions: number[] = [];
  for (let pos = maxDigitPosition; pos >= maxDigitPosition - 2; pos--) {
    rollingPositions.push(pos);
  }
  
  // 判断某个位置是否应该滚动
  const shouldRoll = (position: number): boolean => {
    return rollingPositions.includes(position);
  };
  
  // 固定显示5位小数
  const formatted = convertedValue.toFixed(5);
  const [integerPart, decimalPart = '00000'] = formatted.split('.');
  
  // 确保小数部分有5位
  const paddedDecimalPart = decimalPart.padEnd(5, '0');
  
  // 处理整数部分：小于count-2的位数补9
  const cleanInteger = integerPart.replace(/,/g, ''); // 移除千分位分隔符进行处理
  let finalIntegerDigits = '';
  
  for (let i = cleanInteger.length - 1; i >= 0; i--) {
    const position = cleanInteger.length - i; // 从右到左：1=个位，2=十位，3=百位...
    if (position < maxDigitPosition - 2) {
      // 小于count-2的整数位补9
      finalIntegerDigits = '9' + finalIntegerDigits;
    } else {
      // 保持原数字
      finalIntegerDigits = cleanInteger[i] + finalIntegerDigits;
    }
  }
  
  // 处理小数部分：小于count-2的位数补9
  let finalDecimalPart = paddedDecimalPart;
  for (let i = 0; i < 5; i++) {
    const position = -(i + 1); // -1, -2, -3, -4, -5 (小数位)
    if (position < maxDigitPosition - 2) {
      // 小于count-2的小数位补9
      finalDecimalPart = finalDecimalPart.substring(0, i) + '9' + finalDecimalPart.substring(i + 1);
    }
  }
  
  // 确保最小位数并添加千分位分隔符
  const paddedInteger = finalIntegerDigits.padStart(currencyConfig.minIntegerDigits, '0');
  const finalInteger = currencyConfig.showSeparators && paddedInteger.length > 3 
    ? paddedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : paddedInteger;
  
  return {
    integerPart: finalInteger,
    decimalPart: finalDecimalPart,
    showDecimal: true, // 始终显示5位小数
    convertedValue,
    currencyInfo,
    currencyConfig,
    rollingPositions,
    maxDigitPosition,
    shouldRoll
  };
};

/**
 * 智能数字格式化器（保持原有功能用于非滚动场景）
 */
export const formatCurrencyNumber = (value: number, currency: string): NumberFormatResult => {
  const currencyInfo = EXCHANGE_RATES[currency] || EXCHANGE_RATES.CNY;
  const currencyConfig = CURRENCY_DISPLAY_CONFIG[currency] || CURRENCY_DISPLAY_CONFIG.default;
  
  const convertedValue = value * currencyInfo.rate;
  
  // 智能决定小数位数
  let decimalPlaces = currencyConfig.decimalPlaces;
  
  // 对于普通货币，根据金额大小动态调整小数位
  if (!MEGA_CURRENCIES.includes(currency) && !LARGE_CURRENCIES.includes(currency)) {
    if (convertedValue < 1) {
      decimalPlaces = 4; // 小金额显示更多小数位
    } else if (convertedValue < 100) {
      decimalPlaces = 2;
    } else {
      decimalPlaces = 0; // 大金额不显示小数位
    }
  }
  
  // 格式化数字
  const formatted = convertedValue.toFixed(decimalPlaces);
  const [integerPart, decimalPart = ''] = formatted.split('.');
  
  // 确保最小位数并添加千分位分隔符
  const paddedInteger = integerPart.padStart(currencyConfig.minIntegerDigits, '0');
  const finalInteger = currencyConfig.showSeparators && paddedInteger.length > 3 
    ? paddedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : paddedInteger;
  
  return {
    integerPart: finalInteger,
    decimalPart,
    showDecimal: decimalPlaces > 0 && decimalPart.length > 0,
    convertedValue,
    currencyInfo,
    currencyConfig
  };
};

/**
 * 响应式字体大小计算
 */
export const calculateFontSize = (totalDigits: number, currencyCode: string): string => {
  const isMegaCurrency = MEGA_CURRENCIES.includes(currencyCode);
  const isLargeCurrency = LARGE_CURRENCIES.includes(currencyCode);
  
  // 基础字体大小
  let baseSize = 16;
  
  if (isMegaCurrency) {
    if (totalDigits <= 8) baseSize = 14;
    else if (totalDigits <= 10) baseSize = 12;
    else if (totalDigits <= 12) baseSize = 10;
    else if (totalDigits <= 14) baseSize = 8;
    else baseSize = 6;
  } else if (isLargeCurrency) {
    if (totalDigits <= 6) baseSize = 16;
    else if (totalDigits <= 8) baseSize = 14;
    else if (totalDigits <= 10) baseSize = 12;
    else baseSize = 10;
  } else {
    if (totalDigits <= 4) baseSize = 20;
    else if (totalDigits <= 6) baseSize = 18;
    else if (totalDigits <= 8) baseSize = 15;
    else baseSize = 12;
  }
  
  return `min(${baseSize}vw, ${Math.floor(baseSize * 1.3)}vh)`;
};

/**
 * 货币符号宽度计算
 */
export const calculateCurrencySymbolWidth = (symbol: string, fontSize: string): string => {
  const symbolLength = symbol.length;
  const baseWidth = parseFloat(fontSize.match(/\d+/)?.[0] || '16');
  
  if (symbolLength === 1) return `${baseWidth * 0.5}vw`;
  else if (symbolLength === 2) return `${baseWidth * 0.8}vw`;
  else if (symbolLength === 3) return `${baseWidth * 1.1}vw`;
  else return `${baseWidth * 1.4}vw`;
};

/**
 * 格式化货币用于标题显示
 */
export const formatCurrencyForTitle = (amount: number, currency: string): string => {
  const currencyInfo = EXCHANGE_RATES[currency] || EXCHANGE_RATES.CNY;
  const convertedAmount = amount * currencyInfo.rate;
  return `${currencyInfo.symbol}${convertedAmount.toFixed(2)}`;
}; 