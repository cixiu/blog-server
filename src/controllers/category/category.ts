import { Context } from 'koa';
import * as dateFormat from 'dateformat';

import AdminModel, { AdminType } from '../../models/AdminModel/AdminModel';
import CategoryModel, {
  CategoryType,
} from '../../models/CategoryModel/CategoryModel';

class Category {
  /**
   * 新建标签分类
   *
   * @memberof Category
   */
  public create = async (ctx: Context) => {
    const { title } = ctx.request.body;
    try {
      const { admin_id } = ctx.session!;
      const admin = <AdminType>await AdminModel.findOne({ id: admin_id });
      if (!admin_id) {
        ctx.body = {
          code: 1,
          message: '请先以超级管理员身份登录再创建分类标签',
        };
        return;
      }
      if (admin.type === 1) {
        ctx.body = {
          code: 1,
          message: '您不是超级管理员，不能创建分类标签',
        };
      }
      // 如果是以超级管理员身份登录的
      if (admin.type === 0) {
        if (!title) {
          throw new Error('参数错误');
        } else {
          const category = <CategoryType>await CategoryModel.findOne({ title });
          if (category) {
            ctx.body = {
              code: 1,
              message: '分类标签已经存在，不能重复创建',
            };
            return;
          }
          const newCategory = <CategoryType>await CategoryModel.create({
            title,
            create_time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          });
          const data = {
            id: newCategory.id,
            title: newCategory.title,
            create_time: newCategory.create_time,
          };
          ctx.body = {
            code: 0,
            data,
          };
        }
      }
    } catch (err) {
      console.log(err.message);
      ctx.body = {
        code: 1,
        message: '新建分类标签失败',
      };
    }
  };

  /**
   * 删除指定的分类标签
   *
   * @memberof Category
   */
  public delete = async (ctx: Context) => {
    const { title } = ctx.request.body;
    try {
      const { admin_id } = ctx.session!;
      if (!admin_id) {
        throw new Error('请先登录');
      }
      const admin = <AdminType>await AdminModel.findOne({ id: admin_id });
      if (admin.type === 1) {
        throw new Error('您不是超级管理员，不能删除分类标签');
      }
      if (admin.type === 0) {
        const category = <CategoryType>await CategoryModel.findOne({ title });
        if (!title || !category) {
          throw new Error('没有找到要删除的分类标签');
        }
        await CategoryModel.deleteOne({ title });
        ctx.body = {
          code: 0,
          message: '分类标签删除成功',
        };
      }
    } catch (err) {
      console.log(err.message);
      ctx.body = {
        code: 1,
        message: err.message,
      };
    }
  };

  /**
   * 获取分类标签列表
   *
   * @memberof Category
   */
  public getCategoryList = async (ctx: Context) => {
    try {
      const categoryList = await CategoryModel.find({}, '-_id -__v');
      ctx.body = {
        code: 0,
        data: categoryList,
      };
    } catch (err) {
      console.log(err.message);
      ctx.body = {
        code: 1,
        message: err.message,
      };
    }
  };
}

export default new Category();
