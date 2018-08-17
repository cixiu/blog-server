import * as Router from 'koa-router';
import comment from '../controllers/comment/comment';

const commentRouter = new Router();

commentRouter.post('/create', comment.create);
commentRouter.get('/list', comment.getArticleComment);
commentRouter.post('/like', comment.likeComment);
commentRouter.post('/:commentId/:userId/reply/:respUserId', comment.replyComment);

export default commentRouter;
