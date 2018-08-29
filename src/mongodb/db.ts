import * as mongoose from 'mongoose';
import * as bluebird from 'bluebird';

import { MONGODB_URI, MONGODB_URI_TEST } from '../utils/secrets';
import logger from '../utils/logger';

(<any>mongoose).Promise = bluebird;

console.log('envvvvvvvvvvvvvvvvvv', process.env.NODE_ENV);

const mongodb_uri = process.env.NODE_ENV === 'test' ? MONGODB_URI_TEST : MONGODB_URI;

// 连接数据库
mongoose.connect(mongodb_uri, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => {
  logger.info('连接数据库成功' + mongodb_uri);
});

db.on('error', (error) => {
  logger.error('Error in MongoDb connection: ' + error);
  mongoose.disconnect();
});

db.on('close', () => {
  logger.warning('数据库断开，重新连接数据库');
  mongoose.connect(mongodb_uri);
});

export { mongoose };

export default db;
