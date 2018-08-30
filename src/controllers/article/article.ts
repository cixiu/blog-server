import { Context } from 'koa';
import * as dateFormat from 'dateformat';

import AdminModel, { AdminType } from '../../models/AdminModel/AdminModel';
import ArticleModel, {
  IArticelModel,
  ArticleType,
} from '../../models/ArticleModel/ArticleModel';
import CommentModel from '../../models/CommentModel/CommentModel';
import baseComponent from '../../components/baseComponent/baseComponent';
import { ICreateArticeBody, IGetArticelListQuery, IUpdateArticelBody } from './type';
import logger from '../../utils/logger';

const isTestArticle = (category: IArticelModel['category']) => {
  let isTest = false;
  for (const cate of category) {
    isTest = false;
    if (cate.title === 'test') {
      isTest = true;
      break;
    }
  }
  return isTest;
};

const filterField = '-_id -__v -content -is_test';

class Article extends baseComponent {
  constructor() {
    super();
  }

  /**
   * 创建文章
   *
   * @memberof Article
   */
  public create = async (ctx: Context) => {
    const {
      categorys,
      title,
      screenshot,
      content,
      description,
    }: ICreateArticeBody = ctx.request.body;
    const newCategory: Array<{ title: string }> = [];
    categorys.forEach((item) => {
      newCategory.push({ title: item });
    });
    const is_test = isTestArticle(newCategory);
    try {
      let { admin_id } = ctx.session!;

      admin_id = await this.getSessionId(ctx, 'admin_id');

      const admin = <AdminType>await AdminModel.findOne({ id: admin_id });
      // 只有超级管理员才能发布文章
      if (admin.type === 0) {
        const article_id = await this.getId('article_id');
        const time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
        const newArticleInfo = {
          category: newCategory,
          title,
          screenshot,
          content,
          description,
          author: admin.user_name,
          id: article_id,
          create_time: time,
          last_update_time: time,
          is_test,
        };
        await Promise.all([
          ArticleModel.create(newArticleInfo),
          CommentModel.create({ articleId: article_id }),
        ]);
        ctx.body = {
          code: 0,
          message: '文章发布成功!',
        };
      }
      // 普通管理员不能发布文章
      if (admin.type === 1) {
        ctx.body = {
          code: 1,
          message: '您不是超级管理员，不能发布文章!',
        };
      }
    } catch (err) {
      logger.error(err);
      ctx.body = {
        code: 1,
        message: '文章发布失败!',
      };
    }
  };

  /**
   * 获取文章列表
   *
   * @memberof Article
   */
  public getArticleList = async (ctx: Context) => {
    const {
      limit = 10,
      offset = 0,
      category = 'all',
      sort = 'recently',
      show_test = false,
    }: IGetArticelListQuery = ctx.query;
    let articleList;
    try {
      /* 获取全部文章列表时的查询条件:
       *    1.博客管理系统显示测试分类下的文章
       *    2.博客前端地址不需要显示测试分类下的文章
      */
      const condition = show_test ? {} : { is_test: false };
      if (category === 'all' && sort === 'recently') {
        articleList = await ArticleModel.find(condition, filterField)
          .sort({ id: -1 })
          .skip(Number(offset))
          .limit(Number(limit));
      } else if (category === 'all' && sort === 'read') {
        articleList = await ArticleModel.find(condition, filterField)
          .sort({ views_count: -1 })
          .skip(Number(offset))
          .limit(Number(limit));
      } else {
        // 最近更新使用id进行排序
        // 阅读最多使用views_count进行排序
        const sort_map = {
          recently: 'id',
          read: 'views_count',
        };
        const sort_by = sort_map[sort];
        // const articles = await ArticleModel.find({}, '-_id -__v -content')
        //   .skip(Number(offset))
        //   .limit(Number(limit))
        articleList = await ArticleModel.find(
          {
            category: { $elemMatch: { title: category } },
            is_test: category === 'test',
          },
          filterField,
        )
          .sort({ [sort_by]: -1 })
          .skip(Number(offset))
          .limit(Number(limit));
      }
      if (!articleList || articleList.length === 0) {
        ctx.body = {
          code: 1,
          message: '没有发现文章',
        };
      } else {
        ctx.body = {
          code: 0,
          data: articleList,
        };
      }
    } catch (err) {
      console.log('获取文章列表失败', err);
      ctx.body = {
        code: 1,
        message: '获取文章列表失败',
      };
    }
  };

  /**
   * 获取文章总数
   *
   * @memberof Article
   */
  public getArticleCount = async (ctx: Context) => {
    try {
      const count = await ArticleModel.estimatedDocumentCount();
      ctx.body = {
        code: 0,
        count,
      };
    } catch (err) {
      console.log('获取文章列表数量失败', err);
      ctx.body = {
        code: 1,
        message: '获取文章列表数量失败',
      };
    }
  };

  /**
   * 删除文章
   *
   * @memberof Article
   */
  public deleteArticle = async (ctx: Context) => {
    const { id } = ctx.query;
    try {
      let { admin_id } = ctx.session!;

      admin_id = await this.getSessionId(ctx, 'admin_id');

      const admin = <AdminType>await AdminModel.findOne({ id: admin_id });
      const article = <ArticleType>await ArticleModel.findOne({ id });
      if (!article.id) {
        ctx.body = {
          code: 1,
          message: '没有找到该文章',
        };
      }
      if (admin.type === 0) {
        await ArticleModel.deleteOne({ id });
        ctx.body = {
          code: 0,
          message: '文章删除成功!!!',
        };
      }
      // 普通管理员不能操作文章
      if (admin.type === 1) {
        ctx.body = {
          code: 1,
          message: '普通管理员不能操作文章',
        };
      }
    } catch (err) {
      logger.error(`删除失败: ${err}`);
      ctx.body = {
        code: 1,
        message: '删除失败',
      };
    }
  };

  /**
   * 获取文章详情
   *
   * @memberof Article
   */
  public getArticleDetail = async (ctx: Context) => {
    const { id, update = true } = ctx.query;
    try {
      const article = <ArticleType>await ArticleModel.findOne({ id }, '-_id -__v');
      if (!article) {
        throw new Error('没有找到对应的文章');
      }
      // 如果不是更新，则阅读数量+1
      if (!update) {
        const updateViewsCount = article.views_count + 1;
        await ArticleModel.findOneAndUpdate(
          { id },
          { $set: { views_count: updateViewsCount } },
        );
      }
      ctx.body = {
        code: 0,
        data: article,
      };
    } catch (err) {
      logger.error(`没有找到对应的文章: ${err}`);
      ctx.body = {
        code: 1,
        message: '没有找到对应的文章',
      };
    }
  };

  /**
   * 修改文章
   *
   * @memberof Article
   */
  public updateArticle = async (ctx: Context) => {
    const { categorys, title, screenshot, content, id }: IUpdateArticelBody = ctx.request.body;
    const last_update_time = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss');
    const newCategory: Array<{ title: string }> = [];
    categorys.forEach((item) => {
      newCategory.push({ title: item });
    });
    const is_test = isTestArticle(newCategory);
    const newData = {
      category: newCategory,
      title,
      screenshot,
      content,
      last_update_time,
      is_test,
    };
    try {
      if (!id) {
        throw new Error('请传入要更新的文章的id');
      }
      let { admin_id } = ctx.session!;

      admin_id = await this.getSessionId(ctx, 'admin_id');
      const admin = <AdminType>await AdminModel.findOne({ id: admin_id });
      if (admin.type === 0) {
        await ArticleModel.findOneAndUpdate({ id }, { $set: newData });
        ctx.body = {
          code: 0,
          message: '更新文章成功!!',
        };
      }
      if (admin.type === 1) {
        ctx.body = {
          code: 1,
          message: '您没有修改文章的权限',
        };
      }
    } catch (err) {
      logger.error(`更新文章失败: ${err}`);
      ctx.body = {
        code: 1,
        message: '更新文章失败!!',
      };
    }
  };
}

export default new Article();
