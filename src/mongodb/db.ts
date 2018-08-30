import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

import { MONGODB_URI } from '../utils/secrets';
import logger from '../utils/logger';

(<any>mongoose).Promise = bluebird;

console.log('envvvvvvvvvvvvvvvvvv', process.env.NODE_ENV);

// 连接数据库
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => {
  logger.info('连接数据库成功' + MONGODB_URI);
});

db.on('error', (error) => {
  logger.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('close', () => {
  logger.warning('数据库断开，重新连接数据库');
  mongoose.connect(MONGODB_URI);
});

export { mongoose };

export default db;
