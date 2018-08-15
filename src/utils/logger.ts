import { createLogger, format, transports } from 'winston';
import * as dateFormat from 'dateformat';

const { combine, timestamp, printf } = format;

const logger = createLogger({
  format: combine(
    timestamp(),
    printf((info) => {
      return `${dateFormat(info.timestamp, 'yyyy-mm-dd HH:MM:ss')} ${ info.level }: ${info.message}`;
    }),
  ),
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
    }),
    new transports.File({ filename: 'log/debug.log', level: 'debug' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.debug('开发模式下，初始化logger debug记录');
}

export default logger;
