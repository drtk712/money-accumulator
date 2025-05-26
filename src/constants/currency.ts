import { CurrencyInfo, CurrencyDisplayConfig } from '../types';

// 汇率配置（相对于人民币）
export const EXCHANGE_RATES: Record<string, CurrencyInfo> = {
  CNY: { rate: 1, symbol: '¥', name: '人民币' },
  USD: { rate: 0.14, symbol: '$', name: '美元' },
  EUR: { rate: 0.13, symbol: '€', name: '欧元' },
  JPY: { rate: 20.8, symbol: '¥', name: '日元' },
  KRW: { rate: 188.5, symbol: '₩', name: '韩元' },
  GBP: { rate: 0.11, symbol: '£', name: '英镑' },
  HKD: { rate: 1.1, symbol: 'HK$', name: '港币' },
  TWD: { rate: 4.5, symbol: 'NT$', name: '新台币' },
  SGD: { rate: 0.19, symbol: 'S$', name: '新加坡元' },
  AUD: { rate: 0.21, symbol: 'A$', name: '澳元' },
  CAD: { rate: 0.19, symbol: 'C$', name: '加元' },
  CHF: { rate: 0.13, symbol: 'CHF', name: '瑞士法郎' },
  THB: { rate: 5.1, symbol: '฿', name: '泰铢' },
  MYR: { rate: 0.66, symbol: 'RM', name: '马来西亚林吉特' },
  IDR: { rate: 2180, symbol: 'Rp', name: '印尼盾' },
  VND: { rate: 3500, symbol: '₫', name: '越南盾' },
  ZWL: { rate: 45000000, symbol: 'Z$', name: '津巴布韦币' },
};

// 货币类型分类
export const MEGA_CURRENCIES = ['ZWL', 'IDR', 'VND'];
export const LARGE_CURRENCIES = ['JPY', 'KRW'];

// 优化的货币显示配置
export const CURRENCY_DISPLAY_CONFIG: Record<string, CurrencyDisplayConfig> = {
  ZWL: { 
    maxDigits: 16, 
    animationSpeed: 40, 
    glowIntensity: 'high',
    scrollDelay: 8,
    showSeparators: true,
    decimalPlaces: 0,
    minIntegerDigits: 10
  },
  IDR: { 
    maxDigits: 12, 
    animationSpeed: 50, 
    glowIntensity: 'medium',
    scrollDelay: 12,
    showSeparators: true,
    decimalPlaces: 0,
    minIntegerDigits: 8
  },
  VND: { 
    maxDigits: 12, 
    animationSpeed: 50, 
    glowIntensity: 'medium',
    scrollDelay: 12,
    showSeparators: true,
    decimalPlaces: 0,
    minIntegerDigits: 8
  },
  JPY: { 
    maxDigits: 10, 
    animationSpeed: 60, 
    glowIntensity: 'low',
    scrollDelay: 15,
    showSeparators: true,
    decimalPlaces: 0,
    minIntegerDigits: 6
  },
  KRW: { 
    maxDigits: 10, 
    animationSpeed: 60, 
    glowIntensity: 'low',
    scrollDelay: 15,
    showSeparators: true,
    decimalPlaces: 0,
    minIntegerDigits: 6
  },
  default: { 
    maxDigits: 8, 
    animationSpeed: 80, 
    glowIntensity: 'low',
    scrollDelay: 20,
    showSeparators: false,
    decimalPlaces: 2,
    minIntegerDigits: 4
  }
}; 