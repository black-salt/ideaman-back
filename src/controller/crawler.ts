// import { app } from '../config'
import { Context } from 'koa';
import { get } from '../decorator/httpMethod';
import CrawlerService from '../service/crawler';

export default class CrawlerHandle {
  /**
   * @param ctx Context
   */
  @get('/api/crawler')
  async crawler(ctx: Context) {
    let res = await CrawlerService.startCrawler(); // 新论文类型添加

    ctx.body = {
      code: 0,
      data: `${res}`,
      message: 'success'
    }
  }

  /**
   * @param ctx Context
   */
  @get('/api/crawler/example')
  async crawlerExample(ctx: Context) {
    ctx.body = {
      code: 0,
      data: `这就是个example`,
      message: 'success'
    }
  }

}
