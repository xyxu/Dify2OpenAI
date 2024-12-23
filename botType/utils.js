// utils.js
import { log } from '../config/logger.js';

// 安全地记录对象（移除敏感信息）
export function sanitizeLog(obj) {
  if (!obj) return obj;
  const sanitized = JSON.parse(JSON.stringify(obj));
  
  // 隐藏敏感字段
  if (sanitized.headers && sanitized.headers.authorization) {
    sanitized.headers.authorization = '******';
  }
  if (sanitized.API_KEY) {
    sanitized.API_KEY = '******';
  }
  
  return sanitized;
}

// 记录请求详情
export function logRequest(req, requestId) {
  log('info', '收到新请求', {
    requestId,
    method: req.method,
    url: req.url,
    headers: sanitizeLog(req.headers),
    body: sanitizeLog(req.body),
    query: req.query
  });
}

// 记录响应详情
export function logResponse(requestId, status, data) {
  log('info', '发送响应', {
    requestId,
    status,
    response: sanitizeLog(data)
  });
}

// 记录API调用详情
export function logApiCall(requestId, config, apiPath, duration) {
  log('info', 'Dify API调用完成', {
    requestId,
    apiPath,
    botType: config.BOT_TYPE,
    durationMs: duration
  });
}

// 生成唯一的请求ID
export function generateId() {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 29; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 导出日志函数，以便其他模块直接使用
export { log };