# blog-server
this is a personal blog api server written by node and typescript

## 迁移
本项目是 blog-manage 中的 api 接口服务迁移到这个仓库。并且由原来的 javascript 代码迁移至 typescript。

### 计划
* 完成 react-blog 中余下的功能
  - [x] 用户的登录和注册
  - [x] 文章分类
  - [x] 文章详情
  - [x] 用户对评论的点赞
  - [x] 用户对文章评论
  - [x] 图片的缩放
  - [ ] 用户对文章的收藏 - 暂不支持
  - [ ] 文章搜索 - 暂不支持
  - [ ] 用户个人中心 - 暂不支持
  - [ ] 消息通知 - 暂不支持

* 编写测试
  - [x] 管理员模块
  - [x] 用户模块
  - [x] 文章分类标签模块
  - [ ] 文章模块
  - [ ] 评论模块

### 项目启动
```bash
# first
yarn connect-mongodb

#second
yarn watch
```

### 测试
```bash
# first
yarn connect-mongodb-test

#second
yarn watch-test
```

### changelog
* 2018-8-29
    * 添加了admin, user, category 模块的测试
    * 将session 存入mongodb 中

