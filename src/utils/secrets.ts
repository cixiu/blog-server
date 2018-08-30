import * as fs from 'fs';
import * as dotenv from 'dotenv';
import logger from './logger';

if (process.env.NODE_ENV === 'test') {
  console.info('正在使用 .env.test 文件来配置环境变量');
  dotenv.config({ path: '.env.test' });
} else {
  if (fs.existsSync('.env')) {
    logger.info('正在使用 .env 文件来配置环境变量');
    dotenv.config({ path: '.env' });
  } else {
    // 如果没有 .env 文件， 那么就使用 .env.example 文件作为配置文件
    logger.info('正在使用 .env.example 文件来配置环境变量');
    dotenv.config({ path: '.env.example' });
  }
}

// 由于在 tsconfig.json中开启了 strictNullChecks
// 如果编译器不能够去除 null或 undefined，你可以使用类型断言手动去除。
// 语法是添加 !后缀：identifier!从 identifier的类型里去除了 null和 undefined：
export const ENVIRONMENT = process.env.NODE_ENV!;
const prod = ENVIRONMENT === "production";

export const PORT = process.env.PORT!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const MONGODB_URI = prod ? process.env.MONGODB_URI! : process.env.MONGODB_URI_LOCAL!;
export const COOKIE_KEY = process.env.COOKIE_KEY!;
export const SUPER_SECRET = process.env.SUPER_SECRET!;

if (!SESSION_SECRET) {
  logger.error('没有设置 session 秘钥, 请设置 SESSION_SECRET 变量');
  process.exit(1);
}

if (!MONGODB_URI) {
  logger.error('没有设置 mongodb 连接的uri, 请先设置 MONGODB_URI 变量');
  process.exit(1);
}
