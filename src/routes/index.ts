import * as Koa from 'koa';
import * as Router from 'koa-router';

import adminRouter from './admin';
import articleRouter from './article';
import userRouter from './user';
import commentRouter from './comment';
import categoryRouter from './category';

const router = new Router();

const routerAll = (app: Koa) => {
  router.use('/api/admin', adminRouter.routes(), adminRouter.allowedMethods());
  router.use('/api/article', articleRouter.routes(), articleRouter.allowedMethods());
  router.use('/api/user', userRouter.routes(), userRouter.allowedMethods());
  router.use('/api/comments/:articleId', commentRouter.routes(), commentRouter.allowedMethods());
  router.use('/api/category', categoryRouter.routes(), categoryRouter.allowedMethods());

  router.get('/test', async (ctx) => {
    ctx.body = {
      code: 0,
      message: 'success',
    };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
};

export default routerAll;
