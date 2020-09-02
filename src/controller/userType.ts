import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import { app } from '../config'
import { cpus } from 'os'
import UserTypeService from '../service/userType';

export default class UserType {

  @get('/userTypeinfo', true)
  async userTypeInfo(ctx: Context) {
    const { id } = ctx.query;
    // const token = ctx.state.token;
    // const uid = token.uid;

    //返回 websocket 的端口
    let port = app.socketPort;
    const instance = process.env.NODE_APP_INSTANCE;
    //pm2 cluster模式，根据ip hash计算端口
    if (instance) {
      const ipArr = ctx.request.ip.match(/\d+/g);
      port += parseInt(ipArr.join(''), 10) % cpus().length;
    }

    const userTypes: Array<Object> = await UserTypeService.getUserType({ id: id });

    if (!userTypes.length) {
      return ctx.body = {
        code: 1,
        message: '用户类型不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: userTypes[0],
        socketPort: port,
        message: 'success'
      };
    }
  }

  @post('/userTypeinfo')
  async addUserTypeInfo(ctx: Context) {
    const { type, description } = ctx.request.body;

    const countRet = await UserTypeService.getCount({ type });

    if (countRet > 0) {
      return ctx.body = {
        code: 2,
        message: '该类型已经被添加！'
      }
    }

    const form = {
      type,
      description
    };

    try {
      await UserTypeService.makeNewUserType(form); // 新论文类型添加

      return ctx.body = {
        code: 0,
        message: '添加成功！',
        data: { type, description }
      }
    } catch (e) {
      return ctx.body = {
        code: 3,
        message: '添加失败！'
      }
    }
  }

  @put('/userTypeinfo', true)
  async updateInfo(ctx: Context) {
    const form = ctx.request.body;
    // 做log的时候用 userTypeId:token.uid

    try {
      await UserTypeService.updateUserTypeService(form);
      return ctx.body = {
        code: 0,
        message: '更新成功'
      };
    } catch (e) {
      return ctx.body = {
        code: 2,
        message: '更新失败'
      };
    }
  }

  @del('/userType', true)
  async delUserType(ctx: Context) {
    const { id, deleted } = ctx.request.body;

    // 做log的时候用 userTypeId:token.uid
    try {
      await UserTypeService.deleteUserTypeService({ id, deleted });
      return ctx.body = {
        code: 0,
        message: '删除用户类型成功'
      };
    } catch (e) {

      return ctx.body = {
        code: 2,
        message: '删除用户类型失败'
      };
    }
  }

}