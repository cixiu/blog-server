import * as Router from 'koa-router';

const testRouter = new Router();

testRouter.get('/', async (ctx) => {
  ctx.body = {
    code: 0,
    message: 'success',
  };
});

export default testRouter;
