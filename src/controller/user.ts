import { Context } from 'koa';
import { get, put, del, } from '../decorator/httpMethod';
import { app } from '../config'
import { cpus } from 'os'
import UserService from '../service/user';
import PaperService from '../service/paper';
import { PaperInterface } from '../service/paper';

export default class User {

  @get('/userinfo', true)
  async userInfo(ctx: Context) {
    const { username } = ctx.query;
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

    const users: Array<Object> = await UserService.getUser({ username: username });

    if (!users.length) {
      return ctx.body = {
        code: 1,
        message: '用户不存在'
      };
    } else {
      return ctx.body = {
        code: 0,
        data: users[0],
        socketPort: port,
        message: 'success'
      };
    }
  }

  @put('/userinfo', true)
  async updateInfo(ctx: Context) {
    const form = ctx.request.body;
    // 做log的时候用 userId:token.uid
    const token = ctx.state.token;
    const id = token.uid
    form.id = id

    try {
      await UserService.updateUserService(form);
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

  @del('/user', true)
  async delUser(ctx: Context) {
    const { deleted } = ctx.request.body;
    const token = ctx.state.token;
    const id = token.uid

    // 做log的时候用 userId:token.uid
    try {
      await UserService.deleteUserService({ id, deleted });
      return ctx.body = {
        code: 0,
        message: '删除用户成功'
      };
    } catch (e) {

      return ctx.body = {
        code: 2,
        message: '删除用户失败'
      };
    }
  }


  @get('/connection', true)
  async connection(ctx: Context) {
    // const token = ctx.state.token;
    // const uid = token.uid;

    // const users: Array<Object> = await UserService.getConnectUser({ username: username });
    // const users: Array<Object> = await UserService.getConnectUser({ username: username });
    const fakeData = [
      {
        'id': 2345,
        'name': 'Yoshua Bengio',
        'userAvatarURL': '',
        'badge': 1
      },
      {
        'id': 2375,
        'name': '贾敬哲',
        'userAvatarURL': '',
        'badge': 0
      },
      {
        'id': 576,
        'name': '杨远成',
        'userAvatarURL': '',
        'badge': 0
      }
    ]

    // if (!users.length) {
    //   return ctx.body = {
    //     code: 1,
    //     data: [],
    //     message: 'Connection不存在'
    //   };
    // } else {
    return ctx.body = {
      code: 0,
      data: fakeData,
      message: 'success'
    };
    // }
  }

  @get('/', true)
  async firstPaint(ctx: Context) {
    // const id = 1
    const papers: Array<PaperInterface> = await PaperService.getPaper({ deleted: 0 })
    const res:PaperInterface = papers[0]
    
    return ctx.body = {
      code: 0,
      data:
      [{
        'status_type': 'followed_people_paper',
        'type': 'arxiv',
        'id': res.id,
        'user': res.userId,
        'title': res.title,
        'authors': [res.title],
        'tags': res.tags.split(',').map(item=>item.replace(/[\][']/g,'')),
        'keywords': [
          'Imitation Learning',
          'Reinforcement Learning',
          'Parsing'
        ],
        'link': res.link,
        'abstract': res.description,
        'thumbnailURL': '',
      }],
      message: 'success'
    };
  }


  // const fakeData = [
  //   {
  //     'status_type': 'followed_people_paper',
  //     'type': 'arxiv',
  //     'id': 443,
  //     'user': {
  //       'id': 2345,
  //       'name': 'Yoshua Bengio',
  //     },
  //     'title': 'Learning Neural Parsers with Deterministic Differentiable Imitation Learning',
  //     'authors': [
  //       {
  //         'id': 22,
  //         'name': 'Tanmay Shankar',
  //       },
  //       {
  //         'id': 148,
  //         'name': 'Nicholas Rhinehart',
  //       },
  //       {
  //         'id': 1449,
  //         'name': 'Katharina Muelling',
  //       },
  //       {
  //         'id': 440,
  //         'name': 'Kris M. Kitani',
  //       }
  //     ],
  //     'tags': [
  //       'cs.LG',
  //       'cs.AI',
  //       'cs.CV',
  //       'cs.RO',
  //       'stat.ML',
  //     ],
  //     'keywords': [
  //       'Imitation Learning',
  //       'Reinforcement Learning',
  //       'Parsing'
  //     ],
  //     'link': 'http://blog.lskreno.top',
  //     'abstract': 'We explore the problem of learning to decompose spatial tasks into segments,as exemplified by the problem of a painting robot covering a large object.Inspired by the ability of classical decision tree algorithms to construct structured partitions of their input spaces, we formulate the problem of decomposing objects into segments as a parsing approach. We make the insight that the derivation of a parse-tree that decomposes the object into segments closely resembles a decision tree constructed by ID3, which can be done when the ground-truth available. We learn to imitate an expert parsing oracle, such that our neural parser can generalize to parse natural images without ground truth. We introduce a novel deterministic policy gradient update, DRAG (i.e., DeteRministically AGgrevate) in the form of a deterministic actor-critic variant of AggreVaTeD, to train our neural parser. From another perspective,our approach is a variant of the Deterministic Policy Gradient suitable for the imitation learning setting. The deterministic policy representation offered by training our neural parser with DRAG allows it to outperform state of the art imitation and reinforcement learning approaches.',
  //     'thumbnailURL': '',
  //   },
  //   {
  //     'status_type': 'followed_people_paper',
  //     'type': 'arxiv',
  //     'id': 4432,
  //     'user': {
  //       'id': 985,
  //       'name': '杨远成',
  //     },
  //     'title': 'Loss Aversion in Recommender Systems: Utilizing Negative User Preference to Improve Recommendation Quality',
  //     'authors': [
  //       {
  //         'id': 22,
  //         'name': 'Tanmay Shankar',
  //       },
  //       {
  //         'id': 148,
  //         'name': 'Nicholas Rhinehart',
  //       },
  //       {
  //         'id': 1449,
  //         'name': 'Katharina Muelling',
  //       },
  //       {
  //         'id': 440,
  //         'name': 'Kris M. Kitani',
  //       }
  //     ],
  //     'tags': [
  //       'cs.LG',
  //       'cs.AI',
  //       'cs.CV',
  //       'cs.RO',
  //       'stat.ML',
  //     ],
  //     'keywords': [
  //       'Imitation Learning',
  //       'Reinforcement Learning',
  //       'Parsing'
  //     ],
  //     'url': '',
  //     'abstract': 'Negative user preference is an important context that is not sufficiently utilized by many existing recommender systems. This context is especially useful in scenarios where the cost of negative items is high for the users. We build upon existing machine-learning model to incorporate the contextual information provided by negative user preference.',
  //     'thumbnailURL': '',
  //   },
  //   {
  //     'status_type': 'followed_people_status',
  //     'userAvatarURL': '',
  //     'followed': true,
  //     'username': 'Mohammed',
  //     'userURL': '',
  //     'text': 'My manager Andreas Ehmann talks about how we figure out your music taste at @pandoramusic #pandora #musicir #recsys https://t.co/lj8duIvMcT'
  //   },
  //   {
  //     'status_type': 'recommended_paper',
  //     'type': 'arxiv',
  //     'id': 443,
  //     'user': {
  //       'id': 2345,
  //       'name': 'Yoshua Bengio',
  //     },
  //     'recommendedField': '自然语言处理',
  //     'title': 'Learning Neural Parsers with Deterministic Differentiable Imitation Learning',
  //     'authors': [
  //       {
  //         'id': 22,
  //         'name': 'Tanmay Shankar',
  //       },
  //       {
  //         'id': 148,
  //         'name': 'Nicholas Rhinehart',
  //       },
  //       {
  //         'id': 1449,
  //         'name': 'Katharina Muelling',
  //       },
  //       {
  //         'id': 440,
  //         'name': 'Kris M. Kitani',
  //       }
  //     ],
  //     'tags': [
  //       'cs.LG',
  //       'cs.AI',
  //       'cs.CV',
  //       'cs.RO',
  //       'stat.ML',
  //     ],
  //     'keywords': [
  //       'Imitation Learning',
  //       'Reinforcement Learning',
  //       'Parsing'
  //     ],
  //     'url': '',
  //     'abstract': 'We explore the problem of learning to decompose spatial tasks into segments,as exemplified by the problem of a painting robot covering a large object.Inspired by the ability of classical decision tree algorithms to construct structured partitions of their input spaces, we formulate the problem of decomposing objects into segments as a parsing approach. We make the insight that the derivation of a parse-tree that decomposes the object into segments closely resembles a decision tree constructed by ID3, which can be done when the ground-truth available. We learn to imitate an expert parsing oracle, such that our neural parser can generalize to parse natural images without ground truth. We introduce a novel deterministic policy gradient update, DRAG (i.e., DeteRministically AGgrevate) in the form of a deterministic actor-critic variant of AggreVaTeD, to train our neural parser. From another perspective,our approach is a variant of the Deterministic Policy Gradient suitable for the imitation learning setting. The deterministic policy representation offered by training our neural parser with DRAG allows it to outperform state of the art imitation and reinforcement learning approaches.',
  //     'thumbnailURL': ''
  //   }
  // ]



}