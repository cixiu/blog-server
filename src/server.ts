import * as Koa from 'koa';
import * as Router from 'koa-router';

const app = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = 'hello world';
})

app.use(router.routes());
app.use(router.allowedMethods());


app.listen(9999, () => {
  console.log('server running at http://localhost:9999');
});
