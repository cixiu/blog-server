import * as request from 'supertest';
import app from '../src/app';
import { SUPER_SECRET } from '../src/utils/secrets';

const agent = request.agent(app.callback());

let article_id!: number;

// 创建文章
describe('POST /api/article/create', () => {
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

  test('以超级管理员的身份新建文章', (done) => {
    return agent
      .post('/api/article/create')
      .send({
        categorys: ['test'],
        title: '测试',
        screenshot: '',
        content: '测试新建文章',
        description: '测试新建文章',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 获取文章列表
describe('GET /api/article/list', () => {
  test('获取文章列表', (done) => {
    return agent
      .get('/api/article/list')
      .query({
        category: 'all',
        sort: 'recently',
        show_test: true,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        const lens = resp.body.data.length;
        article_id = resp.body.data[lens - 1].id;
        done();
      });
  });
});

// 获取文章总数
describe('GET /api/article/count', () => {
  test('获取文章总数', (done) => {
    return agent
      .get('/api/article/count')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 获取文章详情
describe('GET /api/article/detail', () => {
  test('获取文章详情', (done) => {
    return agent
      .get('/api/article/detail')
      .query({
        id: article_id,
        update: true,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 修改文章
describe('POST /api/article/update', () => {
  test('修改文章', (done) => {
    return agent
      .post('/api/article/update')
      .send({
        id: article_id,
        categorys: ['test'],
        title: '测试更新',
        screenshot: '',
        content: '测试更新新建文章',
        description: '测试更新新建文章',
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 删除文章
describe('GET /api/article/delete', () => {
  test('删除文章', (done) => {
    console.log('sdfssssssssssssssssssssssssss', article_id);
    return agent
      .get('/api/article/delete')
      .query({
        id: article_id,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});
