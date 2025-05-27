'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Clock, 
  Gem, 
  Coins,
  Crown
} from 'lucide-react';

// 货币类型定义
interface Currency {
  code: string;
  symbol: string;
  name: string;
  displayName: string;
  rate: number;
  icon: string;
}

// 货币配置 - 基于2024年真实汇率更新
const currencies: Currency[] = [
  { code: 'CNY', symbol: '¥', name: '人民币', displayName: '人民币 CNY', rate: 1, icon: '💰' },
  { code: 'USD', symbol: '$', name: '美元', displayName: '美元 USD', rate: 0.139, icon: '💵' },
  { code: 'JPY', symbol: '¥', name: '日元', displayName: '日元 JPY', rate: 19.8, icon: '💴' },
  { code: 'EUR', symbol: '€', name: '欧元', displayName: '欧元 EUR', rate: 0.122, icon: '💶' },
  { code: 'GBP', symbol: '£', name: '英镑', displayName: '英镑 GBP', rate: 0.103, icon: '💷' },
  { code: 'ZWL', symbol: 'Z$', name: '津巴布韦币', displayName: '津巴布韦币 ZWL', rate: 36100000, icon: '💸' },
  { code: 'BTC', symbol: '₿', name: '比特币', displayName: '比特币 BTC', rate: 0.00000129, icon: '₿' },
  { code: 'GOLD', symbol: 'Au', name: '黄金(克)', displayName: '黄金 GOLD', rate: 0.00134, icon: '🥇' },
  { code: 'OIL', symbol: '🛢️', name: '石油(桶)', displayName: '石油 OIL', rate: 0.00193, icon: '🛢️' },
];

// 金钱雨组件
const MoneyRain = () => {
  const [raindrops, setRaindrops] = useState<Array<{id: number, left: number, delay: number, symbol: string}>>([]);

  useEffect(() => {
    const symbols = ['💰', '💵', '💴', '💶', '💷', '💎', '🪙', '💸', '🤑'];
    const drops = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      symbol: symbols[Math.floor(Math.random() * symbols.length)]
    }));
    setRaindrops(drops);
  }, []);

  return (
    <div className="money-rain">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="money-symbol"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {drop.symbol}
        </div>
      ))}
    </div>
  );
};

// 数字滚动组件
const RollingNumber = ({ value, currency }: { value: number; currency: Currency }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsUpdating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsUpdating(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formatNumber = (num: number) => {
    if (currency.code === 'BTC') {
      return num.toFixed(8);
    } else if (currency.code === 'ZWL') {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (currency.code === 'GOLD' || currency.code === 'OIL') {
      return num.toFixed(4);
    } else {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  return (
    <span className={`rolling-number ${isUpdating ? 'updating' : ''}`}>
      {formatNumber(displayValue)}
    </span>
  );
};

export default function MoneyAccumulator() {
  // 状态管理 - 直接使用默认值，在useEffect中加载本地存储
  const [monthlySalary, setMonthlySalary] = useState<number>(10000);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState<number>(22);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('17:30');
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(currencies[0]);
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [todayStartTime, setTodayStartTime] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // 从本地存储加载设置
  const loadFromStorage = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error);
    }
    return defaultValue;
  };

  // 保存设置到本地存储
  const saveToStorage = (key: string, value: string | number | Currency) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  };

  // 初始化时加载本地存储数据
  useEffect(() => {
    setMonthlySalary(loadFromStorage('monthlySalary', 10000));
    setWorkDaysPerMonth(loadFromStorage('workDaysPerMonth', 22));
    setStartTime(loadFromStorage('startTime', '08:00'));
    setEndTime(loadFromStorage('endTime', '17:30'));
    
    const storedCurrency = loadFromStorage('currentCurrency', null);
    if (storedCurrency) {
      const foundCurrency = currencies.find(c => c.code === storedCurrency.code);
      if (foundCurrency) {
        setCurrentCurrency(foundCurrency);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // 监听设置变化并保存到本地存储
  useEffect(() => {
    saveToStorage('monthlySalary', monthlySalary);
  }, [monthlySalary]);

  useEffect(() => {
    saveToStorage('workDaysPerMonth', workDaysPerMonth);
  }, [workDaysPerMonth]);

  useEffect(() => {
    saveToStorage('startTime', startTime);
  }, [startTime]);

  useEffect(() => {
    saveToStorage('endTime', endTime);
  }, [endTime]);

  useEffect(() => {
    saveToStorage('currentCurrency', currentCurrency);
  }, [currentCurrency]);

  // 计算工作小时数
  const calculateWorkHours = useCallback((start: string, end: string) => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    // 处理跨午夜的情况
    if (endMinutes <= startMinutes) {
      return (24 * 60 - startMinutes + endMinutes) / 60;
    }
    
    return (endMinutes - startMinutes) / 60;
  }, []);

  // 计算每秒收入
  const calculatePerSecondEarning = useCallback(() => {
    const workHours = calculateWorkHours(startTime, endTime);
    const dailyEarning = monthlySalary / workDaysPerMonth;
    const hourlyEarning = dailyEarning / workHours;
    const perSecondEarning = hourlyEarning / 3600;
    return perSecondEarning;
  }, [monthlySalary, workDaysPerMonth, startTime, endTime, calculateWorkHours]);

  // 检查是否在工作时间
  const isWorkingTime = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentMinutes = currentHour * 60 + currentMinute;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    const dayOfWeek = now.getDay();
    const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;

    return isWeekday && currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  }, [startTime, endTime]);

  // 获取今天的工作开始时间
  const getTodayWorkStartTime = useCallback(() => {
    const now = new Date();
    const [startHour, startMin] = startTime.split(':').map(Number);
    const workStart = new Date(now);
    workStart.setHours(startHour, startMin, 0, 0);
    return workStart;
  }, [startTime]);

  // 计算从今天工作开始到现在的累积收入
  const calculateAccumulatedEarnings = useCallback(() => {
    if (!isWorkingTime()) return 0;
    
    const now = new Date();
    const workStart = getTodayWorkStartTime();
    
    // 如果现在时间早于今天的工作开始时间，返回0
    if (now < workStart) return 0;
    
    // 计算已工作的秒数
    const workedSeconds = Math.floor((now.getTime() - workStart.getTime()) / 1000);
    const perSecondEarning = calculatePerSecondEarning();
    
    return workedSeconds * perSecondEarning;
  }, [isWorkingTime, getTodayWorkStartTime, calculatePerSecondEarning]);

  // 实时更新收入
  useEffect(() => {
    if (!isLoaded) return; // 等待数据加载完成
    
    const interval = setInterval(() => {
      if (isWorkingTime()) {
        // 自动计算从今天工作开始的累积收入
        const accumulatedEarnings = calculateAccumulatedEarnings();
        setCurrentEarnings(accumulatedEarnings);
        
        // 如果还没有设置今天的开始时间，设置它
        if (!todayStartTime) {
          setTodayStartTime(getTodayWorkStartTime());
        }
      } else {
        // 非工作时间，显示当日累积收入或0
        const accumulatedEarnings = calculateAccumulatedEarnings();
        setCurrentEarnings(accumulatedEarnings);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded, isWorkingTime, calculateAccumulatedEarnings, getTodayWorkStartTime, todayStartTime]);



  // 货币转换
  const convertedEarnings = currentEarnings * currentCurrency.rate;

  // 格式化标题数字
  const formatTitleNumber = useCallback((num: number) => {
    if (currentCurrency.code === 'BTC') {
      return num.toFixed(8);
    } else if (currentCurrency.code === 'ZWL') {
      return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else if (currentCurrency.code === 'GOLD' || currentCurrency.code === 'OIL') {
      return num.toFixed(4);
    } else {
      return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  }, [currentCurrency.code]);

  // 更新网页标题显示收入
  useEffect(() => {
    if (!isLoaded) return; // 等待数据加载完成

    if (convertedEarnings > 0) {
      // 显示收入在标题中
      document.title = `💰 ${currentCurrency.icon} ${formatTitleNumber(convertedEarnings)} ${currentCurrency.symbol} - 财富累积器`;
    } else if (isWorkingTime()) {
      // 工作时间
      document.title = `⏰ 正在工作时间 - 财富累积器`;
    } else {
      // 非工作时间
      document.title = `😴 非工作时间 - 财富累积器`;
    }
  }, [isLoaded, convertedEarnings, currentCurrency, formatTitleNumber, isWorkingTime]);

  // 输入验证函数
  const handleSalaryChange = useCallback((value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10000000) {
      setMonthlySalary(numValue);
    }
  }, []);

  const handleWorkDaysChange = useCallback((value: string) => {
    const numValue = Number(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 31) {
      setWorkDaysPerMonth(numValue);
    }
  }, []);

  return (
    <div className="min-h-screen golden-bg relative overflow-hidden">
      <MoneyRain />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 标题区域 */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-8xl font-bold wealth-text mb-4 flex items-center justify-center gap-4">
            <Gem className="diamond-rotate text-yellow-400" size={80} />
            财富累积器
            <Crown className="diamond-rotate text-yellow-400" size={80} />
          </h1>
          <p className="text-2xl text-yellow-800 font-semibold">
            💰 看着您的财富每秒增长！💰
          </p>
        </motion.div>

        {/* 主要收入显示区域 */}
        <motion.div 
          className="text-center mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-3xl p-8 glow pulse-gold coin-sparkle">
            <div className="text-white mb-4">
              <h2 className="text-3xl font-bold mb-2">💎 当前收入 💎</h2>
              <div className="text-7xl md:text-9xl font-bold mb-4 main-earnings-display">
                {currentCurrency.icon} <RollingNumber value={convertedEarnings} currency={currentCurrency} />
              </div>
              <div className="text-2xl">
                {currentCurrency.symbol} {currentCurrency.displayName}
              </div>
              {isLoaded && isWorkingTime() && (
                <motion.div 
                  className="text-green-200 text-xl mt-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  🟢 正在工作时间 - 收入增长中！
                </motion.div>
              )}
              {isLoaded && !isWorkingTime() && (
                <div className="text-orange-200 text-xl mt-2">
                  🟡 非工作时间 - 显示今日累积收入
                </div>
              )}
              {!isLoaded && (
                <div className="text-yellow-200 text-xl mt-2">
                  💰 正在加载财富数据...
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 设置区域 */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* 工资设置 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-400">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <DollarSign className="text-yellow-600" />
              工资设置
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-yellow-800 font-semibold mb-2">月工资 (元)</label>
                <input
                  type="number"
                  value={monthlySalary}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  className="w-full p-3 rounded-lg golden-input font-bold text-xl"
                  placeholder="请输入月工资"
                  min="0"
                  max="10000000"
                />
              </div>
              <div>
                <label className="block text-yellow-800 font-semibold mb-2">每月工作天数</label>
                <input
                  type="number"
                  value={workDaysPerMonth}
                  onChange={(e) => handleWorkDaysChange(e.target.value)}
                  className="w-full p-3 rounded-lg golden-input font-bold text-xl"
                  placeholder="通常为22天"
                  min="1"
                  max="31"
                />
              </div>
            </div>
          </div>

          {/* 时间设置 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-yellow-400">
            <h3 className="text-2xl font-bold text-yellow-800 mb-4 flex items-center gap-2">
              <Clock className="text-yellow-600" />
              工作时间
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-yellow-800 font-semibold mb-2">上班时间</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-3 rounded-lg golden-input font-bold text-xl"
                />
              </div>
              <div>
                <label className="block text-yellow-800 font-semibold mb-2">下班时间</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-3 rounded-lg golden-input font-bold text-xl"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 货币选择区域 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-yellow-800 mb-4 text-center flex items-center justify-center gap-2">
            <Coins className="text-yellow-600" />
            选择显示货币
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {currencies.map((currency) => (
              <motion.button
                key={currency.code}
                onClick={() => setCurrentCurrency(currency)}
                className={`currency-btn p-3 rounded-xl font-bold text-sm ${
                  currentCurrency.code === currency.code 
                    ? 'ring-4 ring-yellow-300 bg-yellow-500 text-white' 
                    : 'text-yellow-800'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                              >
                  <div className="text-2xl mb-1">{currency.icon}</div>
                  <div className="text-xs">{currency.name}</div>
                  <div className="text-xs opacity-75">{currency.code}</div>
                </motion.button>
            ))}
          </div>
        </motion.div>



        {/* 统计信息 */}
        <motion.div 
          className="mt-12 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-400">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-yellow-800 font-bold">每秒收入</div>
            <div className="text-xl font-bold text-yellow-900 monospace-numbers">
              {`${currentCurrency.symbol}${(calculatePerSecondEarning() * currentCurrency.rate).toFixed(6)}`}
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-400">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-yellow-800 font-bold">日收入</div>
            <div className="text-xl font-bold text-yellow-900 monospace-numbers">
              {`${currentCurrency.symbol}${((monthlySalary / workDaysPerMonth) * currentCurrency.rate).toFixed(2)}`}
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-400">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-yellow-800 font-bold">小时收入</div>
            <div className="text-xl font-bold text-yellow-900 monospace-numbers">
              {`${currentCurrency.symbol}${((monthlySalary / workDaysPerMonth / calculateWorkHours(startTime, endTime)) * currentCurrency.rate).toFixed(2)}`}
            </div>
          </div>
        </motion.div>

        {/* 底部装饰 */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="text-6xl mb-4">💰💎🤑💰💎🤑💰</div>
          <p className="text-yellow-800 font-bold text-xl">
            财从八方来，富贵满堂彩！🎉
          </p>
        </motion.div>
      </div>
    </div>
  );
} 