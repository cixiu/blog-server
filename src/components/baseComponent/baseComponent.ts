import axios from 'axios';
import { Context } from 'koa';
import * as qiniu from 'qiniu';
import * as dateFormat from 'dateformat';
import { SessionModel, SessionType } from '../../models/session';
// import * as path from 'path';

import IdModel, { IId, IdType } from '../../models/id';
import logger from '../../utils/logger';

const baseUrl = 'https://blog.image.tzpcc.cn';
qiniu.conf.ACCESS_KEY = 'uzq4hVSsnTdlKvDIJ7mCq_A2ugsbk2Jn-SSpdTBE';
qiniu.conf.SECRET_KEY = 'iGO_mnUZhSLwLNaagmL6g-TKLqIeqFJ1Ny5Pw1cg';

interface IQiuImageReturn {
  hash: string;
  key: string;
}

class BaseComponent {
  private idList: Array<keyof IId>;

  constructor() {
    this.idList = ['admin_id', 'user_id', 'article_id', 'img_id'];
  }

  public getId = async (type: keyof IId) => {
    console.log(type);
    if (this.idList.indexOf(type) === -1) {
      logger.error('id类型错误');
      throw new Error('id类型错误');
    }

    try {
      const idData = <IdType>await IdModel.findOne();

      if (!idData[type]) {
        idData[type] = 0;
      }

      idData[type]++;
      await idData.save();
      return idData[type];
    } catch (err) {
      logger.error('获取ID数据失败');
      throw new Error(err);
    }
  };

  public fetch = (url = '', data = {}, type = 'GET') => {
    return axios({
      url,
      method: type.toUpperCase(),
      params: data,
      data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  /**
   * 图片上传的controller
   *
   * @memberof BaseComponent
   */
  public uploadImg = async (ctx: Context) => {
    // console.log(ctx.request.files);  // koa-body@2 与 @4有破坏性改变
    try {
      const image = await this.qiniu(ctx);
      ctx.body = {
        code: 0,
        image: {
          ...image,
          url: `${baseUrl}/${image.key}`,
        },
      };
    } catch (err) {
      logger.error(err);
      ctx.body = {
        code: 1,
        message: '上传图片失败',
      };
    }
  };

  /**
   * 通过cookie_key 获取session_id
   *
   * @protected
   * @memberof BaseComponent
   */
  protected getSessionId = async (ctx: Context, session_id: string) => {
    const cookie_key = process.env.COOKIE_KEY!;
    const id = ctx.cookies.get(cookie_key);
    const session = <SessionType>await SessionModel.findOne({ id });
    return session.data[session_id];
  }

  /**
   * 七牛云文件(图片)上传
   *
   * @memberof BaseComponent
   */
  private qiniu = (ctx: Context): Promise<IQiuImageReturn> => {
    return new Promise(async (resolve, reject) => {
      const { files } = ctx.request;
      const time = +new Date();
      // const img_id = await this.getId('img_id');
      const randomImgId = (time + Math.ceil(Math.random() * 10000)).toString(
        16,
      );
      const file = files!.image || files!.file;
      const localFile = file.path;
      const key = `${dateFormat(time, 'yyyy/mm/dd')}/${time}/${randomImgId}`;
      // path.extname(localFile)
      try {
        // 生成上传 token
        const token = this.uptoken('blog', key);
        // 调用uploadFile上传
        const qiniuImg = await this.uploadFile(token, key, localFile);

        resolve(qiniuImg);
      } catch (err) {
        logger.error('保存至七牛云失败', err);
        reject('保存至七牛云失败');
      }
    });
  };

  /**
   * 构建上传策略函数
   *
   * @memberof BaseComponent
   */
  private uptoken = (bucket: string, key: string) => {
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket + ':' + key,
    });
    return putPolicy.uploadToken();
  };

  /**
   * 构造上传函数
   *
   * @memberof BaseComponent
   */
  private uploadFile = (
    uptoken: string,
    key: string,
    localFile: string,
  ): Promise<IQiuImageReturn> => {
    return new Promise((resolve, reject) => {
      const formUploader = new qiniu.form_up.FormUploader();
      const extra = new qiniu.form_up.PutExtra();

      formUploader.putFile(
        uptoken,
        key,
        localFile,
        extra,
        (respErr, respBody: IQiuImageReturn) => {
          if (!respErr) {
            // logger.error(respBody)
            resolve(respBody);
          } else {
            logger.error('图片上传至七牛失败', respErr);
            reject(respErr);
          }
        },
      );
    });
  };
}

export default BaseComponent;
