import * as request from 'supertest';
import app from '../src/app';
import { SUPER_SECRET } from '../src/utils/secrets';

const agent = request.agent(app.callback());

describe('POST /api/admin/login', () => {
  test('超级管理员注册登录', (done) => {
    return agent
      .post('/api/admin/login')
      .send({
        user_name: '测试超级管理员',
        password: '123456',
        super_secret: SUPER_SECRET,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('POST /api/admin/login', () => {
  test('管理员注册登录', (done) => {
    return agent
      .post('/api/admin/login')
      .send({
        user_name: '测试管理员',
        password: '123456',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/admin/info', () => {
  test('获取管理员的信息', (done) => {
    return agent
      .get('/api/admin/info')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/admin/list', () => {
  test('获取管理员列表', (done) => {
    return agent
      .get('/api/admin/list')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/admin/count', () => {
  test('获取管理员总数', (done) => {
    return agent
      .get('/api/admin/count')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/admin/logout', () => {
  test('退出登录', (done) => {
    return agent
      .get('/api/admin/logout')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/admin/upload', () => {
  test('上传图片至七牛云', (done) => {
    return agent
      .post('/api/admin/upload')
      .attach('image', 'public/images/avatar.jpeg')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});
