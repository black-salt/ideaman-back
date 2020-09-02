import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import PaperService from '../service/paper';
import { PaperInterface } from '../service/paper';

export default class Paper {

  @get('/paperinfo', true)
  async paperInfo(ctx: Context) {
    // const id = 1
    const papers: Array<PaperInterface> = await PaperService.getPaper({ deleted: 0 })
    const res: PaperInterface = papers[0]
    const fakeData = {
      'status_type': 'followed_people_paper',
      'type': 'arxiv',
      'id': res.id,
      'user': res.userId,
      'title': res.title,
      'authors': res.authors.split(',').map(item => {
        return { 'name': item }
      }),
      'tags': res.tags.split(',').map(item => item.replace(/[\][']/g, '')),
      'keywords': [
        'Imitation Learning',
        'Reinforcement Learning',
        'Parsing'
      ],
      'link': res.link,
      'abstract': res.description,
      'thumbnailURL': '',
    }
    return ctx.body = {
      code: 0,
      data: fakeData,
      message: 'success'
    };
    // const { id } = ctx.query;
    // const papers: Array<Object> = await PaperService.getPaper({ id: id });

    // if (!papers.length) {
    //   return ctx.body = {
    //     code: 1,
    //     message: '论文不存在'
    //   };
    // } else {
    //   return ctx.body = {
    //     code: 0,
    //     data: papers[0],
    //     message: 'success'
    //   };
    // }
  }

  @post('/paperinfo')
  async addPaperInfo(ctx: Context) {
    const {
      userId, authors, type, citedPapers, conference,
      journal, version, link, title, updated, published,
      pdf_link, description, thumbs } = ctx.request.body;

    const form = {
      userId, authors, type, citedPapers, conference,
      journal, version, link, title, updated, published,
      pdf_link, description, thumbs
    };

    try {
      await PaperService.makeNewPaper(form); // 新论文类型添加

      return ctx.body = {
        code: 0,
        message: '添加成功！',
        data: form
      }
    } catch (e) {
      return ctx.body = {
        code: 3,
        message: '添加失败！'
      }
    }
  }

  @put('/paperinfo', true)
  async updateInfo(ctx: Context) {
    const form = ctx.request.body;

    try {
      await PaperService.updatePaperService(form);
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

  @del('/paper', true)
  async delPaper(ctx: Context) {
    const { deleted } = ctx.request.body;
    const token = ctx.state.token;
    const id = token.uid

    // 做log的时候用 paperId:token.uid
    try {
      await PaperService.deletePaperService({ id, deleted });
      return ctx.body = {
        code: 0,
        message: '删除论文成功'
      };
    } catch (e) {

      return ctx.body = {
        code: 2,
        message: '删除论文失败'
      };
    }
  }

}