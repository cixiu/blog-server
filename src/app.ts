import * as path from 'path';
import * as Koa from 'koa';
import * as session from 'koa-session';
import * as koaBody from 'koa-body';

// 连接mongodb
import './mongodb/db';
import MongooseStore from './models/session';
import { SESSION_SECRET, COOKIE_KEY } from './utils/secrets';
import routerAll from './routes';

const app = new Koa();

// 设置CORS
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', ctx.headers.origin || '*');
  ctx.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With',
  );
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Credentials', 'true'); // 可以带cookies
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
  } else {
    await next();
  }
});

app.keys = [SESSION_SECRET];
const SESSION_CONFIG = {
  key: COOKIE_KEY,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  overwrite: true,
  signed: true,
  store: new MongooseStore(),
};

app.use(session(SESSION_CONFIG, app));

app.use(
  koaBody({
    formLimit: 1024 * 1024,
    textLimit: 1024 * 1024,
    multipart: true,
    formidable: {
      keepExtensions: true,
      uploadDir: path.join(__dirname, '../public/images'),
      onFileBegin: (name, file) => {
        file.path = path.join(__dirname, '../public/images/' + file.name);
      },
    },
  }),
);

routerAll(app);

export default app;
