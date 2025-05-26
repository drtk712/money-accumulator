import { TimeInfo } from '../types';

/**
 * 格式化时间（秒转换为 HH:MM:SS）
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

/**
 * 将时间字符串转换为秒数
 */
export const timeStringToSeconds = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 3600 + minutes * 60;
};

/**
 * 获取当前时间信息
 */
export const getCurrentTimeInfo = (startTime: string, endTime: string): TimeInfo => {
  const now = new Date();
  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const startTimeInSeconds = timeStringToSeconds(startTime);
  const endTimeInSeconds = timeStringToSeconds(endTime);
  
  const workedSeconds = Math.max(0, currentTimeInSeconds - startTimeInSeconds);
  const remainingSeconds = Math.max(0, endTimeInSeconds - currentTimeInSeconds);
  
  return {
    workedTime: formatTime(workedSeconds),
    remainingTime: formatTime(remainingSeconds),
    hourProgress: ((new Date().getMinutes() / 60) * 100).toFixed(1)
  };
};

/**
 * 检查是否在工作时间内
 */
export const isWorkingTime = (startTime: string, endTime: string): boolean => {
  const now = new Date();
  const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const startTimeInSeconds = timeStringToSeconds(startTime);
  const endTimeInSeconds = timeStringToSeconds(endTime);
  
  return currentTimeInSeconds >= startTimeInSeconds && currentTimeInSeconds <= endTimeInSeconds;
}; 