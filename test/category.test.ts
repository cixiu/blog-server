import * as request from 'supertest';
import app from '../src/app';
import { SUPER_SECRET } from '../src/utils/secrets';

const agent = request.agent(app.listen());

// 新建标签分类
describe('POST /api/category/create', () => {
  test('没有登录时', (done) => {
    return agent
      .post('/api/category/create')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(1);
        done();
      });
  });
});

describe('POST /api/category/create', () => {
  test('普通管理员登录', (done) => {
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

  test('普通管理员登录后, 新建标签', (done) => {
    return agent
      .post('/api/category/create')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(1);
        done();
      });
  });
});

describe('POST /api/category/create', () => {
  test('超级管理员登录', (done) => {
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

  test('超级管理员登录后, 新建标签', (done) => {
    return agent
      .post('/api/category/create')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        if (resp.body.code === 0) {
          expect(resp.body.data.title).toBe('测试');
        } else {
          expect(resp.body.code).toBe(1);
        }
        done();
      });
  });
});

// 删除指定的分类标签
describe('POST /api/category/delete', () => {
  test('未登录时，删除已经存在的标签', (done) => {
    return request(app.listen())
      .post('/api/category/delete')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(1);
        done();
      });
  });

  test('普通管理员登录', (done) => {
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

  test('普通管理员登录后，删除已经存在的标签', (done) => {
    return agent
      .post('/api/category/delete')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(1);
        done();
      });
  });

  test('超级管理员登录', (done) => {
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

  test('超级管理员登录后，删除已经存在的标签', (done) => {
    return agent
      .post('/api/category/delete')
      .send({
        title: '测试',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 获取分类标签列表
describe('GET /api/category/list', () => {
  test('获取分类标签列表', (done) => {
    return agent
      .get('/api/category/list')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});
