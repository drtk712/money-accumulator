export interface SalaryConfig {
  monthlySalary: number;
  workDaysPerMonth: number;
  startTime: string;
  endTime: string;
  currency: string;
}

export interface CurrencyInfo {
  rate: number;
  symbol: string;
  name: string;
}

export interface CurrencyDisplayConfig {
  maxDigits: number;
  animationSpeed: number;
  glowIntensity: 'high' | 'medium' | 'low';
  scrollDelay: number;
  showSeparators: boolean;
  decimalPlaces: number;
  minIntegerDigits: number;
}

export interface NumberFormatResult {
  integerPart: string;
  decimalPart: string;
  showDecimal: boolean;
  convertedValue: number;
  currencyInfo: CurrencyInfo;
  currencyConfig: CurrencyDisplayConfig;
}

export interface RollingDigitProps {
  value: number;
  fontSize: string;
  currency: string;
  isGroupSeparator?: boolean;
  separatorChar?: string;
  isDecimal?: boolean;
  position?: number;
  shouldRoll?: boolean;
  incrementPerSecond?: number;
}

export interface RollingNumberDisplayProps {
  value: number;
  currency?: string;
  incrementPerSecond?: number;
}

export interface TimeInfo {
  workedTime: string;
  remainingTime: string;
  hourProgress: string;
}

export interface Statistics {
  dailySalary: string;
  salaryPerSecond: string;
}

export interface RollingAccumulationData {
  rollingPositions: number[];
  maxDigitPosition: number;
  shouldRoll: (position: number) => boolean;
} 