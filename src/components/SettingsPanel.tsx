'use client';

import { motion } from 'framer-motion';
import { SalaryConfig } from '../types';
import { EXCHANGE_RATES } from '../constants/currency';

interface SettingsPanelProps {
  config: SalaryConfig;
  onConfigChange: (field: keyof SalaryConfig, value: string | number) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  config,
  onConfigChange,
  onClose
}) => {
  const handleQuickTimeSet = (startTime: string, endTime: string) => {
    onConfigChange('startTime', startTime);
    onConfigChange('endTime', endTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">工资设置</h2>
        
        {/* 货币选择 */}
        <div className="mb-6">
          <h3 className="text-gray-600 mb-3">💰 货币显示</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {Object.entries(EXCHANGE_RATES).slice(0, 8).map(([code, info]) => (
              <button
                key={code}
                onClick={() => onConfigChange('currency', code)}
                className={`text-sm py-2 px-3 rounded-lg transition-all ${
                  config.currency === code 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {info.symbol} {info.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(EXCHANGE_RATES).slice(8).map(([code, info]) => (
              <button
                key={code}
                onClick={() => onConfigChange('currency', code)}
                className={`text-sm py-2 px-3 rounded-lg transition-all ${
                  config.currency === code 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                }`}
              >
                {info.symbol} {info.name}
              </button>
            ))}
          </div>
        </div>

        {/* 快捷设置 */}
        <div className="mb-6">
          <h3 className="text-gray-600 mb-3">⚡ 快捷设置</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickTimeSet('09:00', '18:00')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded-lg transition-all"
            >
              朝九晚六
            </button>
            <button
              onClick={() => handleQuickTimeSet('08:30', '17:30')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded-lg transition-all"
            >
              8:30-17:30
            </button>
            <button
              onClick={() => handleQuickTimeSet('10:00', '19:00')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded-lg transition-all"
            >
              10:00-19:00
            </button>
            <button
              onClick={() => onConfigChange('workDaysPerMonth', 20)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm py-2 px-3 rounded-lg transition-all"
            >
              月20天
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 mb-2">月薪 (CNY)</label>
            <input
              type="number"
              value={config.monthlySalary}
              onChange={(e) => onConfigChange('monthlySalary', Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="请输入月薪"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-gray-600 mb-2">每月工作天数</label>
            <input
              type="number"
              value={config.workDaysPerMonth}
              onChange={(e) => onConfigChange('workDaysPerMonth', Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="请输入工作天数"
              min="1"
              max="31"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-600 mb-2">上班时间</label>
              <input
                type="time"
                value={config.startTime}
                onChange={(e) => onConfigChange('startTime', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            <div>
              <label className="block text-gray-600 mb-2">下班时间</label>
              <input
                type="time"
                value={config.endTime}
                onChange={(e) => onConfigChange('endTime', e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg mt-8 transition-all"
        >
          保存设置
        </motion.button>
      </motion.div>
    </motion.div>
  );
}; 