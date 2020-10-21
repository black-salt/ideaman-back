import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import PaperService from '../service/paper';
import { PaperInterface } from '../service/paper';

export default class Paper {

  @get('/relatedPaper', true)
  async relatedPaper(ctx: Context) {
    const { paper_id } = ctx.query;
    const papers: Array<PaperInterface> = await PaperService.getRelatedPaper({ id: paper_id });

    

    if (!papers.length) {
      return ctx.body = {
        code: 1,
        message: '论文不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: papers.map(item => {
          return {
            'status_type': 'first_cold_paper',
            'type': 'arxiv',
            'id': item.id,
            'user': item.userId,
            'title': item.title,
            'authors': item.authors.split(','),
            'tags': item.tags.split(',').map(itemy => itemy.replace(/[\][']/g, '')),
            'keywords': [
              'Imitation Learning',
              'Reinforcement Learning',
              'Parsing'
            ],
            'link': item.link,
            'abstract': item.description,
            'published': item.published,
            'journal': item.journal,
            'conference': item.conference,
            'citedPapers': item.citedPapers,
            'updated:': item.updated,
            'thumbnailURL': item.thumbs,
          }
        })[0],
        message: 'success'
      };
    }
  }
  

  @get('/paperinfo', true)
  async paperInfo(ctx: Context) {
    const { id } = ctx.query;
    const papers: Array<PaperInterface> = await PaperService.getPaper({ id: id });

    if (!papers.length) {
      return ctx.body = {
        code: 1,
        message: '论文不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: papers.map(item => {
          return {
            'status_type': 'first_cold_paper',
            'type': 'arxiv',
            'id': item.id,
            'user': item.userId,
            'title': item.title,
            'authors': item.authors.split(','),
            'tags': item.tags.split(',').map(itemy => itemy.replace(/[\][']/g, '')),
            'keywords': [
              'Imitation Learning',
              'Reinforcement Learning',
              'Parsing'
            ],
            'link': item.link,
            'abstract': item.description,
            'published': item.published,
            'journal': item.journal,
            'conference': item.conference,
            'citedPapers': item.citedPapers,
            'updated:': item.updated,
            'thumbnailURL': item.thumbs,
          }
        })[0],
        message: 'success'
      };
    }
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