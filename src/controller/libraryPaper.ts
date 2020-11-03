import { Context } from 'koa';
import { get, put, del, post } from '../decorator/httpMethod';
import LibraryPaperService from '../service/libraryPaper';
import { LibraryPaperInterface } from '../service/libraryPaper';
import PaperService, { PaperInterface } from '../service/paper';

export default class LibraryPaper {

  @get('/library', true)
  async libraryPaperInfo(ctx: Context) {
    const uid = ctx.state.token.uid;
    const libraryPapers: Array<LibraryPaperInterface> = await LibraryPaperService.getLibraryPaperByUser({ uid: uid });
    const LibraryPaperIds: Array<number> = libraryPapers.map(item => Number(item.paperId))
    let res: Array<PaperInterface> = []
    for(let paperId of LibraryPaperIds){
      const paper: Array<PaperInterface> = await PaperService.getPaperByLibraryPaper(paperId);
      if(paper.length)
        res.push(paper[0])
    }
    if (!res.length) {
      return ctx.body = {
        code: 1,
        message: '论文库空空如也'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: res,
        message: 'success'
      };
    }
  }

  @post('/library')
  async addLibraryPaper(ctx: Context) {
    const { userId, paperId } = ctx.request.body;

    const form = {
      userId, paperId
    };

    try {
      await LibraryPaperService.makeNewLibraryPaper(form); // 新论文类型添加
      return ctx.body = {
        code: 0,
        message: '添加成功！',
        data: {
          userId, paperId
        }
      }
    } catch (e) {
      console.info(e)
      return ctx.body = {
        code: 3,
        message: '添加失败！'
      }
    }
  }

  @put('/library', true)
  async updateInfo(ctx: Context) {
    const form = ctx.request.body;
    // 做log的时候用 libraryPaperId:token.uid

    try {
      await LibraryPaperService.updateLibraryPaperService(form);
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

  @del('/libraryPaper', true)
  async delLibraryPaper(ctx: Context) {
    const { userId, paperId } = ctx.request.body;
    // 做log的时候用 libraryPaperId:token.uid
    try {
      await LibraryPaperService.deleteLibraryPaperService({ paperId: paperId, userId: userId });
      return ctx.body = {
        code: 0,
        message: '删除文库论文成功'
      };
    } catch (e) {

      return ctx.body = {
        code: 2,
        message: '删除文库论文失败'
      };
    }
  }


  @post('/library/iscollect', true)
  async isLibraryPaper(ctx: Context) {
    const { userId, paperId } = ctx.request.body;
    try {
      const libraryPaperCount: Array<Object> =
        await LibraryPaperService.isLibraryPaper(
          { userId: userId, paperId: paperId }
        );

      return ctx.body = {
        code: 0,
        data: libraryPaperCount ? 1 : 0,
        message: 'success'
      };
    } catch (e) {
      return ctx.body = {
        code: 5,
        message: '服务器错误'
      };
    }
  }

}


// const fakeData = [
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper1`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper2`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper3`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper4`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper5`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper6`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper7`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper8`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper9`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper10`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'

//     ],
//     'keywords': [
//       'This is Keywords'

//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
//   {
//     'type': 'Example: This is type',
//     'id': '001',
//     'title': 'This is paper`s title',
//     'authors': [
//       {
//         'id': 22,
//         'name': 'first author'
//       },
//       {
//         'id': 148,
//         'name': 'second author'
//       },
//       {
//         'id': 1449,
//         'name': 'third author'
//       }
//     ],
//     'tags': [
//       'This is Tag'
//     ],
//     'keywords': [
//       'This is Keywords'
//     ],
//     'url': 'www.baidu.com',
//     'abstract': 'This is abstract',
//     'thumbnailURL': ''
//   },
// ]
