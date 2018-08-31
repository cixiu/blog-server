import * as request from 'supertest';
import axios from 'axios';
import app from '../src/app';
import { SUPER_SECRET } from '../src/utils/secrets';

const agent = request.agent(app.callback());

let article_id!: number;
let userId!: number;
let commentId!: number;
let respUserId!: number;

beforeAll(async () => {
  const resp = await agent
    .post('/api/user/login')
    .send({
      username: '测试用户',
      password: '123456',
    });

  const resp2 = await agent
  .post('/api/user/login')
  .send({
    username: '测试用户',
    password: '123456',
  });

  userId = resp.body.data.id;
  respUserId = resp2.body.data.id;
});

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

/*
  评论相关的api
*/
// 新建评论
describe('POST /api/comments/:articleId/create', () => {
  test('给文章评论', (done) => {
    return agent
      .post(`/api/comments/${article_id}/create`)
      .send({
        userId,
        content: '这是一条测试的评论',
      })
      .set('cookie', 'userId=gfjdlagjhlfdla')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        commentId = resp.body.data.id;
        done();
      });
  });
});

// 文章的评论列表
describe('POST /api/comments/:articleId/list', () => {
  test('文章的评论列表', (done) => {
    return agent
      .get(`/api/comments/${article_id}/list`)
      .query({
        userId,
      })
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 点赞评论
describe('POST /api/comments/:articleId/like', () => {
  test('点赞评论', (done) => {
    return agent
      .post(`/api/comments/${article_id}/like`)
      .send({
        userId,
        commentId,
      })
      .set('cookie', 'userId=gfjdlagjhlfdla')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

// 回复评论
describe('POST /api/comments/:articleId/:commentId/:userId/reply/:respUserId', () => {
  test('回复评论', (done) => {
    return agent
      .post(`/api/comments/${article_id}/${commentId}/${userId}/reply/${respUserId}`)
      .send({
        content: '这是一条回复的测试',
      })
      .set('cookie', 'userId=gfjdlagjhlfdla')
      .expect(200)
      .end((err, resp) => {
        expect(resp.error).not.toBeUndefined();
        expect(resp.body.code).toBe(0);
        done();
      });
  });
});

//
//
// 删除文章
describe('GET /api/article/delete', () => {
  test('删除文章', (done) => {
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
