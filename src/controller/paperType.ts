import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import { app } from '../config'
import { cpus } from 'os'
import PaperTypeService from '../service/paperType';

export default class PaperType {

  @get('/paperTypeinfo', true)
  async paperTypeInfo(ctx: Context) {
    const { id } = ctx.query;

    //返回 websocket 的端口
    let port = app.socketPort;
    const instance = process.env.NODE_APP_INSTANCE;
    //pm2 cluster模式，根据ip hash计算端口
    if (instance) {
      const ipArr = ctx.request.ip.match(/\d+/g);
      port += parseInt(ipArr.join(''), 10) % cpus().length;
    }

    const paperTypes: Array<Object> = await PaperTypeService.getPaperType({ id: id });

    if (!paperTypes.length) {
      return ctx.body = {
        code: 1,
        message: '论文类型不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: paperTypes[0],
        socketPort: port,
        message: 'success'
      };
    }
  }

  @post('/paperTypeinfo')
  async addPaperTypeInfo(ctx: Context) {
    const { type, description } = ctx.request.body;

    const countRet = await PaperTypeService.getCount({ type });

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
      await PaperTypeService.makeNewPaperType(form); // 新论文类型添加

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

  @put('/paperTypeinfo', true)
  async updateInfo(ctx: Context) {
    const form = ctx.request.body;
    // 做log的时候用 paperTypeId:token.uid

    try {
      await PaperTypeService.updatePaperTypeService(form);
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

  @del('/paperType', true)
  async delPaperType(ctx: Context) {
    const { id, deleted } = ctx.request.body;

    // 做log的时候用 paperTypeId:token.uid
    try {
      await PaperTypeService.deletePaperTypeService({ id, deleted });
      return ctx.body = {
        code: 0,
        message: '删除论文类型成功'
      };
    } catch (e) {

      return ctx.body = {
        code: 2,
        message: '删除论文类型失败'
      };
    }
  }

}