import * as request from 'supertest';
import app from '../src/app';

describe('POST /api/user/login', () => {
  test('用户注册登录', (done) => {
    return request(app.callback())
      .post('/api/user/login')
      .field('username', '测试用户')
      .field('password', '123456 ')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/user/info', () => {
  test('获取用户的信息', (done) => {
    return request(app.callback())
      .get('/api/user/info')
      .query({
        user_id: 1,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/user/list', () => {
  test('获取用户列表', (done) => {
    return request(app.callback())
      .get('/api/user/list')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/user/count', () => {
  test('获取用户总数', (done) => {
    return request(app.callback())
      .get('/api/user/count')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

describe('GET /api/user/logout', () => {
  test('退出登录', (done) => {
    return request(app.callback())
      .get('/api/user/logout')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});
