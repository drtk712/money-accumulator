import { useState, useEffect, useMemo } from 'react';
import { SalaryConfig } from '../types';
import { EXCHANGE_RATES } from '../constants/currency';
import { timeStringToSeconds, isWorkingTime } from '../utils/time';

export const useSalaryCalculator = (config: SalaryConfig) => {
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [isWorkTime, setIsWorkTime] = useState(false);
  const [workProgress, setWorkProgress] = useState(0);

  // 计算统计信息和每秒增量
  const statistics = useMemo(() => {
    const currencyInfo = EXCHANGE_RATES[config.currency] || EXCHANGE_RATES.CNY;
    const workMinutesPerDay = (parseInt(config.endTime.split(':')[0]) - parseInt(config.startTime.split(':')[0])) * 60 + 
                             (parseInt(config.endTime.split(':')[1]) - parseInt(config.startTime.split(':')[1]));
    const workSecondsPerDay = workMinutesPerDay * 60;
    
    if (workSecondsPerDay <= 0) {
      return {
        statistics: {
          dailySalary: `${currencyInfo.symbol}0.00`,
          salaryPerSecond: `${currencyInfo.symbol}0.000000`
        },
        incrementPerSecondCNY: 0,
        incrementPerSecondConverted: 0
      };
    }
    
    const dailySalaryCNY = config.monthlySalary / config.workDaysPerMonth;
    const incrementPerSecondCNY = dailySalaryCNY / workSecondsPerDay;
    
    const dailySalary = dailySalaryCNY * currencyInfo.rate;
    const incrementPerSecondConverted = incrementPerSecondCNY * currencyInfo.rate;
    
    return {
      statistics: {
        dailySalary: `${currencyInfo.symbol}${dailySalary.toFixed(2)}`,
        salaryPerSecond: `${currencyInfo.symbol}${incrementPerSecondConverted.toFixed(6)}`
      },
      incrementPerSecondCNY,
      incrementPerSecondConverted
    };
  }, [config]);

  const { statistics: statisticsData, incrementPerSecondCNY } = statistics;

  // 计算实时工资
  useEffect(() => {
    const calculateEarnings = () => {
      try {
        const now = new Date();
        const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const startTimeInSeconds = timeStringToSeconds(config.startTime);
        const endTimeInSeconds = timeStringToSeconds(config.endTime);
        
        // 检查是否在工作时间
        const isCurrentlyWorkTime = isWorkingTime(config.startTime, config.endTime);
        setIsWorkTime(isCurrentlyWorkTime);
        
        // 使用已计算的增量，避免重复计算
        if (incrementPerSecondCNY <= 0) return; // 防止除零错误
        
        let todayEarnings = 0;
        let progress = 0;
        const workSecondsPerDay = endTimeInSeconds - startTimeInSeconds;
        
        if (workSecondsPerDay <= 0) return; // 防止除零错误
        
        if (isCurrentlyWorkTime) {
          const workedSeconds = Math.max(0, currentTimeInSeconds - startTimeInSeconds);
          todayEarnings = workedSeconds * incrementPerSecondCNY;
          progress = Math.min((workedSeconds / workSecondsPerDay) * 100, 100);
        } else if (currentTimeInSeconds > endTimeInSeconds) {
          todayEarnings = config.monthlySalary / config.workDaysPerMonth;
          progress = 100;
        } else {
          todayEarnings = 0;
          progress = 0;
        }
        
        setCurrentEarnings(todayEarnings);
        setWorkProgress(progress);
      } catch (error) {
        console.error('Error calculating earnings:', error);
        // 设置安全的默认值
        setCurrentEarnings(0);
        setWorkProgress(0);
        setIsWorkTime(false);
      }
    };

    calculateEarnings();
    const interval = setInterval(calculateEarnings, 1000);
    
    return () => clearInterval(interval);
  }, [config, incrementPerSecondCNY]);

  return {
    currentEarnings,
    isWorkTime,
    workProgress,
    statistics: statisticsData,
    incrementPerSecond: incrementPerSecondCNY // 返回人民币增量，让格式化器自己转换
  };
}; 