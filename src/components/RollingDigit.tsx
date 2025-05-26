'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RollingDigitProps } from '../types';
import { CURRENCY_DISPLAY_CONFIG, EXCHANGE_RATES } from '../constants/currency';
import { getDigitAtPosition } from '../utils/currency';

export const RollingDigit: React.FC<RollingDigitProps> = ({ 
  value, 
  fontSize,
  currency,
  isGroupSeparator = false,
  separatorChar = ',',
  isDecimal = false,
  position = 0,
  shouldRoll = true,
  incrementPerSecond = 0
}) => {
  const [currentDigit, setCurrentDigit] = useState(value);
  const [isRolling, setIsRolling] = useState(false);
  const [rollDirection, setRollDirection] = useState<'up' | 'down'>('up');
  const lastUpdateTime = useRef<number>(Date.now());
  const accumulatedValue = useRef<number>(0);

  // 获取货币配置
  const currencyConfig = CURRENCY_DISPLAY_CONFIG[currency] || CURRENCY_DISPLAY_CONFIG.default;
  
  // 计算转换后的增量
  const convertedIncrement = useMemo(() => {
    const currencyInfo = EXCHANGE_RATES[currency] || EXCHANGE_RATES.CNY;
    return incrementPerSecond * currencyInfo.rate;
  }, [incrementPerSecond, currency]);

  // 新的累加滚动逻辑
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let intervalId: NodeJS.Timeout | null = null;
    
    if (isGroupSeparator || !shouldRoll) {
      // 分隔符或不需要滚动的位置，直接设置值
      setCurrentDigit(value);
      return;
    }

    // 如果是累加模式且有增量
    if (convertedIncrement > 0 && position !== 0) {
      const now = Date.now();
      const deltaTime = (now - lastUpdateTime.current) / 1000; // 转换为秒
      lastUpdateTime.current = now;

      // 累加增量（使用转换后的增量）
      accumulatedValue.current += convertedIncrement * deltaTime;

      // 获取当前位置应该显示的数字
      const targetDigit = getDigitAtPosition(accumulatedValue.current, position);
      
      if (targetDigit !== currentDigit && targetDigit >= 0 && targetDigit <= 9) {
        setIsRolling(true);
        
        // 智能滚动方向计算
        let direction: 'up' | 'down' = 'up';
        let steps = 0;
        
        if (targetDigit > currentDigit) {
          steps = targetDigit - currentDigit;
          direction = 'up';
        } else if (targetDigit < currentDigit) {
          const downSteps = currentDigit - targetDigit;
          const upSteps = (10 - currentDigit) + targetDigit;
          
          if (downSteps <= upSteps) {
            steps = downSteps;
            direction = 'down';
          } else {
            steps = upSteps;
            direction = 'up';
          }
        }
        
        setRollDirection(direction);
        
        // 根据位置计算延迟
        const baseDelay = isDecimal ? currencyConfig.scrollDelay * 0.3 : currencyConfig.scrollDelay * 0.5;
        const delayFromRight = Math.abs(position) * baseDelay;
        
        timeoutId = setTimeout(() => {
          if (steps === 0) {
            setCurrentDigit(targetDigit);
            setIsRolling(false);
            return;
          }
          
          let currentStep = 0;
          intervalId = setInterval(() => {
            if (currentStep < steps) {
              setCurrentDigit(prev => {
                if (direction === 'up') {
                  return (prev + 1) % 10;
                } else {
                  return prev === 0 ? 9 : prev - 1;
                }
              });
              currentStep++;
            } else {
              if (intervalId) clearInterval(intervalId);
              setCurrentDigit(targetDigit);
              setIsRolling(false);
            }
          }, currencyConfig.animationSpeed * 0.8); // 稍快的动画
        }, Math.min(delayFromRight, 200)); // 限制最大延迟
      }
    } else {
      // 非累加模式，直接设置值
      if (value !== currentDigit && value >= 0 && value <= 9) {
        setCurrentDigit(value);
      }
    }

    // 清理函数
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [value, currentDigit, isGroupSeparator, shouldRoll, convertedIncrement, position, currencyConfig, isDecimal]);

  // 重置累加值当主值变化时
  useEffect(() => {
    accumulatedValue.current = value;
    lastUpdateTime.current = Date.now();
  }, [value]);

  // 优化的样式计算
  const digitStyle = useMemo(() => {
    const glowEffects = {
      high: isRolling 
        ? '0 0 80px rgba(255, 215, 0, 1), 0 0 40px rgba(34, 197, 94, 0.9), 0 0 20px rgba(255, 255, 255, 0.8)' 
        : '0 0 60px rgba(255, 215, 0, 0.8), 0 0 30px rgba(34, 197, 94, 0.7), 0 0 15px rgba(255, 255, 255, 0.6)',
      medium: isRolling 
        ? '0 0 60px rgba(34, 197, 94, 0.9), 0 0 30px rgba(255, 215, 0, 0.7)' 
        : '0 0 40px rgba(34, 197, 94, 0.7), 0 0 20px rgba(255, 215, 0, 0.5)',
      low: isRolling 
        ? '0 0 50px rgba(34, 197, 94, 0.8)' 
        : '0 0 30px rgba(34, 197, 94, 0.6)'
    };

    const baseWidth = isDecimal ? 0.6 : 0.7; // 小数位稍窄
    let opacity = isDecimal ? 0.9 : 1; // 小数位稍淡
    
    // 不滚动的位置透明度更低
    if (!shouldRoll && !isGroupSeparator) {
      opacity *= 0.7;
    }

    return {
      fontSize: fontSize,
      lineHeight: '1',
      width: `calc(${fontSize} * ${baseWidth})`,
      textShadow: glowEffects[currencyConfig.glowIntensity],
      filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3))',
      transform: isRolling ? `scale(${currencyConfig.glowIntensity === 'high' ? '1.05' : '1.02'})` : 'scale(1)',
      transition: 'all 0.15s ease-out',
      opacity: opacity
    };
  }, [fontSize, currencyConfig, isRolling, isDecimal, shouldRoll, isGroupSeparator]);

  // 分隔符渲染
  if (isGroupSeparator) {
    return (
      <span 
        className="inline-block font-bold text-green-500 font-mono text-center opacity-50"
        style={{
          fontSize: fontSize,
          lineHeight: '1',
          width: `calc(${fontSize} * 0.25)`,
          textShadow: '0 0 15px rgba(34, 197, 94, 0.3)',
          margin: '0 2px'
        }}
      >
        {separatorChar}
      </span>
    );
  }

  return (
    <motion.span
      animate={{
        y: isRolling ? (rollDirection === 'up' ? [-8, 0] : [8, 0]) : 0,
        scale: isRolling ? [0.96, 1.04, 1] : 1,
        rotateX: isRolling ? [0, rollDirection === 'up' ? -10 : 10, 0] : 0
      }}
      transition={{
        duration: currencyConfig.animationSpeed / 1000 * 1.2,
        ease: "easeOut"
      }}
      className="inline-block font-bold text-green-500 font-mono text-center"
      style={digitStyle}
    >
      {currentDigit}
    </motion.span>
  );
}; 