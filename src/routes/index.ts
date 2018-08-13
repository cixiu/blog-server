import * as Koa  from 'koa';
import * as Router from 'koa-router';

const router = new Router();

const routerAll = (app: Koa) => {

  router.get('/test', async ctx => {
    ctx.body = {
      code: 0,
      message: 'success'
    }
  })

  app.use(router.routes());
  app.use(router.allowedMethods());
}

export default routerAll;
