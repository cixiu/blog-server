import * as Router from 'koa-router';
import admin from '../controllers/admin/admin';

const adminRouter = new Router();

adminRouter.post('/register', admin.register);
adminRouter.post('/login', admin.login);
adminRouter.get('/logout', admin.logout);
adminRouter.get('/info', admin.getAdminInfo);
adminRouter.get('/list', admin.getAdminList);
adminRouter.get('/count', admin.getAdminCount);
adminRouter.post('/upload', admin.uploadImg);

export default adminRouter;
