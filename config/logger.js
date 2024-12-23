import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// 定义日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

// 添加颜色支持
winston.addColors(colors);

// 创建格式化器
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// 根据环境创建不同的传输配置
function getTransports() {
  const isDev = process.env.NODE_ENV === 'development';
  
  // 生产环境只在控制台输出错误
  if (!isDev) {
    return [
      new winston.transports.Console({
        level: 'error',
        format: winston.format.simple()
      })
    ];
  }
  
  // 开发环境完整日志
  return [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d'
    }),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d'
    })
  ];
}

// 创建 Winston logger
const logger = winston.createLogger({
  levels,
  format,
  transports: getTransports()
});

// 导出日志函数
export const log = (level, message, meta = {}) => {
  // 非开发环境且不是错误，则不记录日志
  if (process.env.NODE_ENV !== 'development' && level !== 'error') {
    return;
  }
  
  logger.log(level, message, {
    timestamp: new Date().toISOString(),
    ...meta,
  });
};

export default logger;
