import * as Router from 'koa-router';
import category from '../controllers/category/category';

const categoryRouter = new Router();

categoryRouter.post('/create', category.create);
categoryRouter.post('/delete', category.delete);
categoryRouter.get('/list', category.getCategoryList);

export default categoryRouter;
