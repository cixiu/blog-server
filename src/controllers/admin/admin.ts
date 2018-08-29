import { Context } from 'koa';
import * as md5 from 'md5';
import * as dateFormat from 'dateformat';

// import { SessionModel, SessionType } from '../../models/session';
import AdminModel, { AdminType } from '../../models/AdminModel/AdminModel';
import AddressComponent, { IAddressInfo } from '../../components/addressComponent/addressComponent';
import logger from '../../utils/logger';
import { SUPER_SECRET } from '../../utils/secrets';

// 过滤数据库中的_id _v password 字段
const filterField = '-_id -__v -password';

class Admin extends AddressComponent {
  constructor() {
    super();
  }

  /**
   * 管理员注册
   *
   * @memberof Admin
   */
  public register = async (ctx: Context) => {
    const { user_name, password, super_secret } = ctx.request.body;
    try {
      if (!user_name) {
        throw new Error('用户名不能为空');
      } else if (!password) {
        throw new Error('密码不能为空');
      }
    } catch (err) {
      logger.error(err.message);
      ctx.body = {
        code: 1,
        message: err.message,
      };
      return;
    }
    try {
      const admin = <AdminType>await AdminModel.findOne({ user_name });
      if (admin) {
        console.log('用户名已存在');
        ctx.body = {
          code: 1,
          message: '用户名已存在',
        };
      } else {
        const roleType =
          super_secret === SUPER_SECRET ? '超级管理员' : '管理员';
        const admin_id = await this.getId('admin_id');
        const addressInfo = <IAddressInfo>await this.guessPosition(ctx.req);
        const create_address = `${addressInfo.province} ${addressInfo.city}`;
        const newPassword = this.md5(password);
        const newAdmin = {
          user_name,
          password: newPassword,
          type: super_secret === SUPER_SECRET ? 0 : 1,
          id: admin_id,
          create_time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          create_address,
          role: roleType,
        };

        await AdminModel.create(newAdmin);
        ctx.session!.admin_id = admin_id;
        ctx.body = {
          code: 0,
          message: '注册管理员成功',
        };
      }
    } catch (err) {
      console.log('注册管理员失败', err);
      ctx.body = {
        code: 1,
        message: '注册管理员失败',
      };
    }
  };

  /**
   * 管理员登录
   *
   * @memberof Admin
   */
  public login = async (ctx: Context) => {
    const { user_name, password, super_secret } = ctx.request.body;
    try {
      if (!user_name) {
        throw new Error('用户名不能为空');
      }
      if (!password) {
        throw new Error('密码不能为空');
      }
    } catch (err) {
      console.log(err.message);
      ctx.body = {
        code: 1,
        message: err.message,
      };
      return;
    }
    const newPassword = this.md5(password);
    try {
      const admin = <AdminType>await AdminModel.findOne({ user_name });
      // 如果没有找到admin 则注册
      if (!admin) {
        const roleType =
          super_secret === SUPER_SECRET ? '超级管理员' : '管理员';
        const admin_id = await this.getId('admin_id');
        const addressInfo = <IAddressInfo>await this.guessPosition(ctx.req);
        const create_address = `${addressInfo.province} ${addressInfo.city}`;
        const newAdmin = {
          user_name,
          password: newPassword,
          type: super_secret === SUPER_SECRET ? 0 : 1,
          id: admin_id,
          create_time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          create_address,
          role: roleType,
        };
        await AdminModel.create(newAdmin);
        ctx.session!.admin_id = admin_id;
        ctx.body = {
          code: 0,
          message: '注册管理员成功',
        };
      } else if (newPassword !== admin.password) { // 如果密码不匹配
        logger.error('管理员登录密码错误');
        ctx.body = {
          code: 1,
          message: '用户名已经存在，但是登录密码错误',
        };
      } else { // 否则登录成功
        ctx.session!.admin_id = admin.id;
        ctx.body = {
          code: 0,
          message: '登录成功',
        };
      }
    } catch (err) {
      console.log(err);
      logger.error('注册管理员失败', err);
      ctx.body = {
        code: 1,
        message: '注册管理员失败',
      };
    }
  };

  /**
   * 退出登录
   *
   * @memberof Admin
   */
  public logout = async (ctx: Context) => {
    try {
      delete ctx.session!.admin_id;
      ctx.body = {
        code: 0,
        message: '退出成功',
      };
    } catch (err) {
      logger.error('退出失败', err);
      ctx.body = {
        code: 1,
        message: '退出失败',
      };
    }
  };

  /**
   * 密码加盐
   *
   * @memberof Admin
   */
  public md5 = (password: string) => {
    const newPassword = md5(md5(password + 'hello@web.com') + '132753skldf');
    return newPassword;
  }

  /**
   * 获取管理员信息
   *
   * @memberof Admin
   */
  public getAdminInfo = async (ctx: Context) => {
    let { admin_id } = ctx.session!;

    admin_id = await this.getSessionId(ctx, 'admin_id');

    // console.log(admin_id);
    // console.log('ssssssss', ctx.cookies.get('gtx1080ti'));
    // const id = ctx.cookies.get('gtx1080ti');
    // const data = <SessionType>await SessionModel.findOne({ id });
    // admin_id = data.data.admin_id;
    // console.log('dsfsdhgs', data);
    // console.log(ctx);
    if (!admin_id) {
      logger.debug('管理员的session失效或者未登录');
      ctx.body = {
        code: 1,
        message: '获取管理员信息失败',
      };
      return;
    }
    try {
      const info = <AdminType>await AdminModel.findOne(
        { id: admin_id },
        filterField,
      );
      if (!info) {
        throw new Error('未找到管理员');
      } else {
        ctx.body = {
          code: 0,
          data: info,
        };
      }
    } catch (err) {
      logger.error('获取管理员信息失败');
      ctx.body = {
        code: 1,
        message: '获取管理员信息失败',
      };
    }
  };

  /**
   * 获取管理员列表
   *
   * @memberof Admin
   */
  public getAdminList = async (ctx: Context) => {
    const { limit = 10, offset = 0 } = ctx.query;
    try {
      const adminList = <AdminType[]>await AdminModel.find({}, filterField)
        .sort({ id: -1 })
        .skip(Number(offset))
        .limit(Number(limit));

      ctx.body = {
        code: 0,
        data: adminList,
      };
    } catch (err) {
      logger.error('获取管理员列表失败', `${err}`);
      ctx.body = {
        code: 1,
        message: '获取管理员列表失败',
      };
    }
  };

  /**
   * 获取管理员总数
   *
   * @memberof Admin
   */
  public getAdminCount = async (ctx: Context) => {
    try {
      const count = await AdminModel.estimatedDocumentCount();
      ctx.body = {
        code: 0,
        count,
      };
    } catch (err) {
      logger.error('获取管理员列表失败', err);
      ctx.body = {
        code: 1,
        message: '获取管理员数量失败',
      };
    }
  };
}

export default new Admin();
