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

// 从 URL 中提取文件扩展名
export function getFileExtension(url) {
  // 如果是 base64 数据，从 MIME 类型提取
  if (url.startsWith('data:')) {
    const mimeMatch = url.match(/data:([^;]+)/);
    if (mimeMatch && mimeMatch[1]) {
      const mime = mimeMatch[1];
      // 常见 MIME 类型映射到扩展名
      const mimeToExt = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'application/pdf': 'pdf',
        'text/plain': 'txt',
        'text/html': 'html',
        'audio/mpeg': 'mp3',
        'video/mp4': 'mp4'
      };
      return mimeToExt[mime] || 'bin'; // 默认二进制文件
    }
    return 'bin'; // 默认二进制文件
  }
  
  // 如果是 URL，清除参数并提取扩展名
  try {
    // 移除 URL 参数
    const cleanUrl = url.split('?')[0];
    // 获取最后一部分并提取扩展名
    const parts = cleanUrl.split('/');
    const filename = parts[parts.length - 1];
    const ext = filename.split('.').pop().toLowerCase();
    return ext || 'bin'; // 如果没有扩展名，返回默认值
  } catch (error) {
    log('warn', '无法从 URL 提取文件扩展名', { url: url.substring(0, 30) + '...', error });
    return 'bin';
  }
}

// 根据扩展名判断文件类型
export function getFileType(extension) {
  // 根据 Dify API 文档中的类型分类
  const documentExts = ['txt', 'md', 'markdown', 'pdf', 'html', 'xlsx', 'xls', 'docx', 'csv', 'eml', 'msg', 'pptx', 'ppt', 'xml', 'epub'];
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const audioExts = ['mp3', 'm4a', 'wav', 'webm', 'amr'];
  const videoExts = ['mp4', 'mov', 'mpeg', 'mpga'];
  
  // 将扩展名转为小写进行比较
  const ext = extension.toLowerCase();
  
  if (documentExts.includes(ext)) return 'document';
  if (imageExts.includes(ext)) return 'image';
  if (audioExts.includes(ext)) return 'audio';
  if (videoExts.includes(ext)) return 'video';
  
  // 默认作为自定义类型
  return 'custom';
}

// 导出日志函数，以便其他模块直接使用
export { log };