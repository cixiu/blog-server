import * as Router from 'koa-router';
import Admin from '../controllers/admin/admin';

const adminRouter = new Router();

adminRouter.post('/register', Admin.register);
adminRouter.post('/login', Admin.login);
adminRouter.get('/logout', Admin.logout);
adminRouter.get('/info', Admin.getAdminInfo);
adminRouter.get('/list', Admin.getAdminList);
adminRouter.get('/count', Admin.getAdminCount);
adminRouter.post('/upload', Admin.uploadImg);

export default adminRouter;
