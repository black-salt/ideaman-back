import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import PaperService from '../service/paper';
import OfflinePaperService from '../service/offline';
import { OfflinePaperInterface } from '../service/offline';
import { PaperInterface } from '../service/paper';
import AuthorService from '../service/author';
import AuthorInterface from '../service/author';

export default class Paper {

  @get('/relatedPaper', true)
  async relatedPaper(ctx: Context) {
    const { paper_id } = ctx.query;
    let papers: Array<OfflinePaperInterface> = await OfflinePaperService.getRelatedPaper({ paperId: +paper_id });
    let len = papers.length
    const offlinePapers = papers[len - 1].recs.split(',').map(item => +item)

    // 取出 offlinePapers 的论文详情
    // const offlinePapers = papers[len - 1].recs.split(',')
    // let relatedRecPapers: Array<PaperInterface> = await PaperService.getPaperByPaperIds(offlinePapers);
    const relatedRecPapers: Array<PaperInterface> = []
    for await (const paperId of offlinePapers) {
      let res: Array<PaperInterface> = await PaperService.getPaper({id: paperId})
      relatedRecPapers.push(res[0])
    }


    if (!papers.length) {
      return ctx.body = {
        code: 1,
        message: '暂无您的离线推荐论文'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: relatedRecPapers,
        message: 'success'
      };
    }
  }


  @get('/paperinfo', true)
  async paperInfo(ctx: Context) {
    const { id } = ctx.query;
    const papers: Array<PaperInterface> = await PaperService.getPaper({ id: id });
    const paperDetail = papers.map(item => {
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
    })[0]

    const authors:string[] = []
    for await (const authorId of paperDetail.authors.map(itemx => +itemx)) {
      let res:Array<AuthorInterface> = await AuthorService.getAuthor({id: authorId})
      authors.push(res[0]['author'])
    }
    paperDetail.authors = authors


    if (!papers.length) {
      return ctx.body = {
        code: 1,
        message: '论文不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: paperDetail,
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