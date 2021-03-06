import * as request from 'supertest';
import app from '../src/app';

const agent = request.agent(app.callback());

let userId!: number;

describe('POST /api/user/login', () => {
  test('用户注册登录', (done) => {
    return agent
      .post('/api/user/login')
      .send({
        username: '测试用户',
        password: '123456',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        userId = resp.body.data.id;
        done();
      });
  });
});

describe('GET /api/user/info', () => {
  test('获取用户的信息', (done) => {
    return agent
      .get('/api/user/info')
      .query({
        user_id: userId,
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
    return agent
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
    return agent
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
    return agent
      .get('/api/user/logout')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});
