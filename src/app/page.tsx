'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';

// 导入模块化组件和Hook
import { RollingNumberDisplay, SettingsPanel } from '../components';
import { useSalaryCalculator } from '../hooks/useSalaryCalculator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SalaryConfig } from '../types';
import { getCurrentTimeInfo } from '../utils/time';
import { formatCurrencyForTitle } from '../utils/currency';

export default function Home() {
  // 使用本地存储Hook管理配置
  const [config, setConfig] = useLocalStorage<SalaryConfig>('salaryConfig', {
    monthlySalary: 10000,
    workDaysPerMonth: 22,
    startTime: '09:00',
    endTime: '18:00',
    currency: 'CNY'
  });

  // 使用工资计算Hook
  const { currentEarnings, isWorkTime, workProgress, statistics, incrementPerSecond } = useSalaryCalculator(config);
  
  const [showSettings, setShowSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');

  // 更新网页标题
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let titlePrefix = '';
      if (isWorkTime) {
        titlePrefix = '💰 ';
      } else {
        const now = new Date();
        const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
        const endTimeInSeconds = parseInt(config.endTime.split(':')[0]) * 3600 + parseInt(config.endTime.split(':')[1]) * 60;
        
        if (currentTimeInSeconds > endTimeInSeconds) {
          titlePrefix = '✅ ';
        } else {
          titlePrefix = '⏰ ';
        }
      }
      
      document.title = `${titlePrefix}${formatCurrencyForTitle(currentEarnings, config.currency)} - 实时工资`;
    }
  }, [currentEarnings, isWorkTime, config.endTime, config.currency]);

  // 里程碑检测
  useEffect(() => {
    const dailySalary = config.monthlySalary / config.workDaysPerMonth;
    
    const milestones = [
      { threshold: 0.5, message: '🎉 恭喜！今天已经赚到一半日薪了！' },
      { threshold: 0.8, message: '🚀 太棒了！今天已经完成80%的目标！' },
      { threshold: 1.0, message: '🎊 完美！今天的日薪目标达成！' }
    ];

    for (const milestone of milestones) {
      const thresholdEarnings = dailySalary * milestone.threshold;
      if (currentEarnings >= thresholdEarnings && currentEarnings < thresholdEarnings + (dailySalary * 0.01)) {
        setCelebrationMessage(milestone.message);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        break;
      }
    }
  }, [currentEarnings, config.monthlySalary, config.workDaysPerMonth]);

  const handleConfigChange = useCallback((field: keyof SalaryConfig, value: string | number) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }, [setConfig]);

  // 获取时间信息
  const timeInfo = getCurrentTimeInfo(config.startTime, config.endTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 relative overflow-hidden">
      {/* 背景装饰圆点 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-4 h-4 bg-yellow-300 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-orange-300 rounded-full opacity-40"></div>
        <div className="absolute bottom-32 left-16 w-8 h-8 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-orange-400 rounded-full opacity-30"></div>
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-yellow-500 rounded-full opacity-70"></div>
        <div className="absolute top-2/3 right-1/4 w-5 h-5 bg-orange-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-yellow-400 rounded-full opacity-60"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 container mx-auto px-4 py-4 min-h-screen flex flex-col">
        {/* 头部 */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            实时工资计算器
          </h1>
          <p className="text-gray-600 text-lg">看见你的每一秒价值</p>
        </motion.div>

        {/* 状态标题 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            您已经赚了
          </h2>
        </motion.div>

        {/* 超大滚动数字显示区域 */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex items-center justify-center"
            style={{ height: '50vh' }}
          >
            <RollingNumberDisplay value={currentEarnings} currency={config.currency} incrementPerSecond={incrementPerSecond} />
          </motion.div>
        </div>

        {/* 底部信息卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-4 md:p-6 w-full max-w-6xl mx-auto mt-4"
        >
          {/* 进度条区域 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">今日工作进度</div>
              <div className="text-xl font-bold text-gray-800">{workProgress.toFixed(1)}%</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">当前小时进度</div>
              <div className="text-xl font-bold text-gray-800">{timeInfo.hourProgress}%</div>
            </div>
          </div>

          {/* 详细信息 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">已工作</div>
              <div className="text-lg font-semibold text-gray-800">{timeInfo.workedTime}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">下班倒计时</div>
              <div className="text-lg font-semibold text-gray-800">{timeInfo.remainingTime}</div>
            </div>
          </div>

          {/* 收入统计 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">每日收入</div>
              <div className="text-lg font-semibold text-gray-800">{statistics.dailySalary}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600 mb-1 text-sm">每秒收入</div>
              <div className="text-lg font-semibold text-gray-800">{statistics.salaryPerSecond}</div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              设置
            </motion.button>
          </div>
        </motion.div>

        {/* 设置面板 */}
        <AnimatePresence>
          {showSettings && (
            <SettingsPanel
              config={config}
              onConfigChange={handleConfigChange}
              onClose={() => setShowSettings(false)}
            />
          )}
        </AnimatePresence>

        {/* 庆祝动画 */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: -50 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl shadow-2xl text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className="text-2xl font-bold"
                >
                  {celebrationMessage}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
