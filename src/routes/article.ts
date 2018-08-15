import * as Router from 'koa-router';
import article from '../controllers/article/article';

const articleRouter = new Router();

articleRouter.post('/create', article.create);
articleRouter.get('/list', article.getArticleList);
articleRouter.get('/count', article.getArticleCount);
articleRouter.get('/delete', article.deleteArticle);
articleRouter.get('/detail', article.getArticleDetail);
articleRouter.post('/update', article.updateArticle);

export default articleRouter;
