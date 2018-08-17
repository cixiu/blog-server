import { Context } from 'koa';
import * as md5 from 'md5';
import * as dateFormat from 'dateformat';

import UserModel, { UserType, IUserModel } from '../../models/UserModel/UserModel';
import AddressComponent, { IAddressInfo } from '../../components/addressComponent/addressComponent';

class User extends AddressComponent {
  constructor() {
    super();
  }

  /**
   * 用户登录
   *
   * @memberof User
   */
  public login = async (ctx: Context) => {
    const { username, password } = ctx.request.body;
    try {
      if (!username) {
        throw new Error('用户名不能为空');
      } else if (password.length < 6) {
        throw new Error('密码不能小于6位');
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
      const user = <UserType>await UserModel.findOne({ username });
      // 如果没有username 则注册
      if (!user) {
        const user_id = await this.getId('user_id');
        const addressInfo = <IAddressInfo>await this.guessPosition(ctx.req);
        const create_address = `${addressInfo.province} ${addressInfo.city}`;
        const newUser = {
          username,
          password: newPassword,
          avatar: '',
          id: user_id,
          createAt: +new Date(),
          create_time: dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss'),
          create_address,
        };
        await UserModel.create(newUser);
        ctx.session!.user_id = user_id;
        console.log(ctx.session);
        const { password: ingorePassword, ...info } = newUser;
        ctx.body = {
          code: 0,
          message: '注册成功',
          data: info,
        };
      } else if (newPassword !== user.password) { // 如果登录密码与数据库中用户的密码不一致
        console.log('登录密码错误');
        ctx.body = {
          code: 1,
          message: '用户名已经存在，但是登录密码错误',
        };
      } else {
        ctx.session!.user_id = user.id;
        const info = <UserType>await UserModel.findOne(
          { id: user.id },
          '-_id -__v -password',
        );
        ctx.body = {
          code: 0,
          message: '登录成功',
          data: info,
        };
      }
    } catch (err) {
      console.log('注册失败', err);
      ctx.body = {
        code: 1,
        message: '注册失败',
      };
    }
  }

  /**
   * 获取用户信息
   *
   * @memberof User
   */
  public getUserInfo = async (ctx: Context) => {
    const user_id = ctx.session!.user_id || ctx.query.user_id;
    // console.log('session', ctx.session.user_id)
    // console.log('query', ctx.query.user_id)
    if (!user_id) {
      console.log('用户的session失效或者用户id没有传入或者未登录');
      ctx.body = {
        code: 1,
        message: '获取用户信息失败',
      };
      return;
    }
    try {
      const info = <UserType>await UserModel.findOne(
        { id: user_id },
        '-_id -__v -password',
      );
      if (!info) {
        throw new Error('未找到用户');
      } else {
        ctx.body = {
          code: 0,
          data: info,
        };
      }
    } catch (err) {
      console.log('获取用户信息失败');
      ctx.body = {
        code: 1,
        message: '获取用户信息失败',
      };
    }
  }

  /**
   * 获取用户列表
   *
   * @memberof User
   */
  public getUserList = async (ctx: Context) => {
    const { limit = 10, offset = 0 } = ctx.query;
    try {
      const userList = await UserModel.find({}, '-_id -__v -password')
        .sort({ id: -1 })
        .skip(Number(offset))
        .limit(Number(limit));
      ctx.body = {
        code: 0,
        data: userList,
      };
    } catch (err) {
      console.log('获取用户列表失败', err);
      ctx.body = {
        code: 1,
        message: '获取用户列表失败',
      };
    }
  }

  /**
   * 获取用户总数
   *
   * @memberof User
   */
  public getUserCount = async (ctx: Context) => {
    try {
      const count = await UserModel.estimatedDocumentCount();
      ctx.body = {
        code: 0,
        count,
      };
    } catch (err) {
      console.log('获取用户数量失败', err);
      ctx.body = {
        code: 1,
        message: '获取用户数量失败',
      };
    }
  }

  /**
   * 退出登录
   *
   * @memberof User
   */
  public logout = async (ctx: Context) => {
    try {
      delete ctx.session!.user_id;
      ctx.body = {
        code: 0,
        message: '退出成功',
      };
    } catch (err) {
      console.log('退出失败', err);
      ctx.body = {
        code: 1,
        message: '退出失败',
      };
    }
  }

  /**
   * 密码加盐
   *
   * @private
   * @memberof User
   */
  private md5 = (password: string) => {
    return md5(md5(password + 'hello@web.com') + '132753skldf');
  }
}

export default new User();
