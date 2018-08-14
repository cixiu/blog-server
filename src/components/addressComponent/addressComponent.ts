import { Context } from 'koa';
import BaseComponent from '../baseComponent/baseComponent';
import logger from '../../utils/logger';

const ERR_OK = '1';
const GAODE_KEY = '16809cb6982af3530e83816c7c6d58ce';

export interface IAddressInfo {
  adcode: string;
  province: string;
  city: string;
  rectangle: string;
}

class AddressComponent extends BaseComponent {
  private gaodekey: string;

  constructor() {
    super();
    this.gaodekey = GAODE_KEY;
  }
  // 根据ip地址获取地址
  public guessPosition = async (req: Context['req']): Promise<IAddressInfo | {}> => {
    return new Promise(async (resolve, reject) => {
      // 请求头remote-ip在前端服务端渲染做用户登录的代理转发时进行了设置
      // 不然无法获得正确的ip地址
      let ip = (req.headers['remote-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress) as string;
      const ipArr = ip!.split(',');

      if (ipArr.length > 0) {
        ip = ipArr[0];
      }

      if (process.env.NODE_ENV === 'development') {
        ip = '175.10.241.243';
      }

      logger.info(ip);
      try {
        const result = await this.fetch('http://restapi.amap.com/v3/ip', {
          ip,
          key: this.gaodekey,
        });

        if (result.data.status === ERR_OK) {
          const addressInfo: IAddressInfo = {
            adcode: result.data.adcode,
            province: result.data.province,
            city: result.data.city,
            rectangle: result.data.rectangle,
          };
          resolve(addressInfo);
        } else {
          reject('定位失败');
        }
      } catch (err) {
        logger.error('定位失败');
        reject('定位失败');
      }
    });
  };
}

export default AddressComponent;
