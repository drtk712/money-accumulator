'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RollingNumberDisplayProps } from '../types';
import { RollingDigit } from './RollingDigit';
import { formatRollingCurrencyNumber, calculateFontSize, calculateCurrencySymbolWidth } from '../utils/currency';

export const RollingNumberDisplay: React.FC<RollingNumberDisplayProps> = ({ 
  value, 
  currency = 'CNY',
  incrementPerSecond = 0
}) => {
  const [previousValue, setPreviousValue] = useState(value);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const formatData = useMemo(() => 
    formatRollingCurrencyNumber(value, currency, incrementPerSecond), 
    [value, currency, incrementPerSecond]
  );
  
  const { 
    integerPart, 
    decimalPart, 
    showDecimal, 
    currencyInfo, 
    currencyConfig,
    rollingPositions,
    maxDigitPosition,
    shouldRoll
  } = formatData;
  
  // 货币切换时的平滑过渡
  useEffect(() => {
    if (value !== previousValue) {
      setIsTransitioning(true);
      setPreviousValue(value);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [value, previousValue]);

  // 将整数部分转换为数字和分隔符的数组，并计算位置
  const integerElements = useMemo(() => {
    const elements: Array<{ 
      type: 'digit' | 'separator'; 
      value: string | number; 
      index: number;
      position: number;
    }> = [];
    let digitIndex = 0;
    
    // 从右到左计算位置
    const cleanInteger = integerPart.replace(/,/g, '');
    
    for (let i = 0; i < integerPart.length; i++) {
      const char = integerPart[i];
      if (char === ',') {
        elements.push({ 
          type: 'separator', 
          value: char, 
          index: i,
          position: 0 // 分隔符位置为0
        });
      } else {
        const positionFromRight = cleanInteger.length - digitIndex;
        elements.push({ 
          type: 'digit', 
          value: parseInt(char), 
          index: digitIndex,
          position: positionFromRight // 正数表示整数位
        });
        digitIndex++;
      }
    }
    
    return elements;
  }, [integerPart]);

  // 小数部分数字和位置
  const decimalElements = useMemo(() => {
    return decimalPart.split('').map((digit, index) => ({
      value: parseInt(digit),
      index: index,
      position: -(index + 1) // 负数表示小数位
    }));
  }, [decimalPart]);

  const totalDigits = integerElements.filter(el => el.type === 'digit').length + decimalElements.length;
  const fontSize = calculateFontSize(totalDigits, currency);

  return (
    <motion.div 
      className="flex items-center justify-center flex-wrap gap-1" 
      style={{ minWidth: '85vw' }}
      animate={{ 
        scale: isTransitioning ? [1, 0.98, 1] : 1,
        opacity: isTransitioning ? [1, 0.9, 1] : 1
      }}
      transition={{ duration: 0.3 }}
    >
      {/* 货币符号 */}
      <motion.span 
        animate={{
          scale: [1, 1.06, 1],
          textShadow: [
            '0 0 25px rgba(34, 197, 94, 0.4)',
            '0 0 50px rgba(34, 197, 94, 0.8)',
            '0 0 25px rgba(34, 197, 94, 0.4)'
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="font-bold text-green-500 text-center flex items-center justify-center"
        style={{
          fontSize: fontSize,
          lineHeight: '1',
          width: calculateCurrencySymbolWidth(currencyInfo.symbol, fontSize),
          marginRight: `calc(${fontSize} * 0.1)`,
          minWidth: calculateCurrencySymbolWidth(currencyInfo.symbol, fontSize),
          textShadow: currencyConfig.glowIntensity === 'high' 
            ? '0 0 35px rgba(255, 215, 0, 0.8), 0 0 18px rgba(34, 197, 94, 0.6)'
            : '0 0 25px rgba(34, 197, 94, 0.6)'
        }}
      >
        {currencyInfo.symbol}
      </motion.span>
      
      {/* 整数部分（包含分隔符） */}
      <div className="flex items-center">
        {integerElements.map((element, arrayIndex) => (
          <RollingDigit 
            key={`int-${arrayIndex}`} 
            value={element.type === 'digit' ? element.value as number : 0}
            fontSize={fontSize}
            currency={currency}
            isGroupSeparator={element.type === 'separator'}
            separatorChar={element.value as string}
            isDecimal={false}
            position={element.position}
            shouldRoll={element.type === 'digit' ? shouldRoll(element.position) : false}
            incrementPerSecond={incrementPerSecond}
          />
        ))}
      </div>
      
      {/* 小数点 */}
      {showDecimal && (
        <span 
          className="font-bold text-green-500 text-center opacity-70"
          style={{
            fontSize: fontSize,
            lineHeight: '1',
            width: `calc(${fontSize} * 0.25)`,
            display: 'inline-block',
            textShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
            margin: '0 1px'
          }}
        >.</span>
      )}
      
      {/* 小数部分（固定5位） */}
      {showDecimal && (
        <div className="flex items-center">
          {decimalElements.map((element, index) => (
            <RollingDigit 
              key={`dec-${index}`} 
              value={element.value}
              fontSize={fontSize}
              currency={currency}
              isDecimal={true}
              position={element.position}
              shouldRoll={shouldRoll(element.position)}
              incrementPerSecond={incrementPerSecond}
            />
          ))}
        </div>
      )}
      
      {/* 调试信息（开发时可见） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs">
          <div>增量/秒: {incrementPerSecond.toFixed(6)}</div>
          <div>最大位数: {maxDigitPosition}</div>
          <div>滚动范围: {rollingPositions.join(', ')}</div>
        </div>
      )}
    </motion.div>
  );
}; 