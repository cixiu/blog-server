import * as Router from 'koa-router';
import user from '../controllers/user/user';

const userRouter = new Router();

userRouter.post('/login', user.login);
userRouter.get('/info', user.getUserInfo);
userRouter.get('/list', user.getUserList);
userRouter.get('/count', user.getUserCount);
userRouter.get('/logout', user.logout);

export default userRouter;
