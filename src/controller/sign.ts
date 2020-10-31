import crypto from 'crypto'
// import uuid from 'uuid/v1'
import { Context } from 'koa';
import { post } from '../decorator/httpMethod'
import UserService from '../service/user';
import {mailSender} from '../common/mailSender'

// 用户 接口类型
interface UserInterface {
  id?: number,
  username: string,
  type: string,
  name: string,
  salt: string,
  hashPassword: string,
  email: string,
  avatar?: string,
  signature?: string,
  status?: number,
  isBlock?: number,
  addTime: Date,
  updateTime: Date,
  deleted?: number
  // TagName: Array<string>, // 和User表无关，这个是栗子
  // Category: Array<string>,// 和User表无关，这个是栗子
}
const makeSalt = () => Math.round((new Date().valueOf() * Math.random())) + ''; //generate salt
const encryptPass = (pass: string, salt: string) => crypto.createHash('md5').update(pass + salt).digest('hex');// generate md5

export default class Sign {

  @post('/login')
  async login(ctx: Context) {
    const { username, password } = ctx.request.body;
    // 先查一下这个用户在不在数据库里
    const users: Array<UserInterface> = await UserService.getUser({ username: username });
    console.info(users[0])
    if (!users.length) {
      return ctx.body = {
        code: 2,
        message: '用户不存在'
      };
    }
    // 取出salt（就是密钥），将表单里用户输入的password加密一下，对比看是否相同
    if (users[0].hashPassword !== encryptPass(password, users[0].salt)) {
      return ctx.body = {
        code: 3,
        message: '密码错误'
      };
    }
    // ctx.sign()这个方法是在 addRouter 的时候绑定到 ctx 上的
    await ctx.sign({ uid: users[0].id, username });
    return ctx.body = {
      code: 0,
      message: '登录成功',
      data: [
        {
          id: users[0].id,
          username: users[0].username,
          email: users[0].email,
          name: users[0].name,
          avatar: users[0].avatar,
          signature: users[0].signature,
          status: users[0].status,
          isBlock: users[0].isBlock
        }
      ]
    };
  }

  @post('/register')
  async register(ctx: Context) {
    // const { username, password, name, email, phoneNumber } = ctx.request.body;
    const { username, password, name, email } = ctx.request.body;

    const salt = makeSalt(); // 生成加密的盐
    const hash_password = encryptPass(password, salt); //根据盐对密码进行加密处理

    const countRet = await UserService.getCount({ username });

    if (countRet > 0) {
      return ctx.body = {
        code: 2,
        message: '该用户名已经被注册！'
      }
    }
    // const id = uuid();
    const nowDate = new Date(); //当前时间

    const form = {
      // id,
      salt,
      hashPassword: hash_password,
      username: <string>username,
      name: <string>name,
      email: <string>email,
      type: '2', //userType表里的 id
      signature: '我是Idea Man新成员啦',
      addTime: nowDate, 
      updateTime: nowDate
    };

    try {
      await UserService.makeNewUser(form); // 新用户注册
      const newUser: UserInterface = await UserService.getUserInfo(form); // 新用户注册

      ctx.sign({ uid: newUser.id, username }); //注册成功后立即登陆
      return ctx.body = {
        code: 0,
        message: '注册成功！',
        data: {
          username: newUser.username,
          name: newUser.name,
          email: newUser.email,
          signature: newUser.signature
        }
      }
    } catch (e) {
      console.info(e)
      return ctx.body = {
        code: 3,
        message: '注册失败！'
      }
    }
  }

  @post('/sendVerificationCode')
  async sendVerificationCode(ctx: Context) {
    const { username } = ctx.request.body;

    // 根据用户名查找用户
    const users: Array<UserInterface> = await UserService.getUser({ username: username });
    if (!users.length) {
      return ctx.body = {
        code: 2,
        message: '用户不存在'
      };
    }

    // 生成6位数字字符串验证码
    let verificationCode: string = Math.random().toString().slice(-6);

    //发送邮件
    try {
      await mailSender(users[0].email, 'Ideaman找回密码', '验证码：'+verificationCode+'，有效时间3分钟')
      ctx.session.verificationCode = verificationCode // 将验证码存入session
      return ctx.body = {
        code: 0,
        message: '已发送验证码'
      }
    } catch (e) {
      console.info(e)
      return ctx.body = {
        code: 3,
        message: '发送失败！'
      }
    }
  }

  @post('/forgetPassword')
  async forgetPassword(ctx: Context) {

    const { username, password, verificationCode } = ctx.request.body
    // 校验验证码
    if(ctx.session.verificationCode !== verificationCode) {
      return ctx.body = {
        code: 1,
        message: '验证码错误'
      };
    }
    // 先查一下这个用户在不在数据库里
    const users: Array<UserInterface> = await UserService.getUser({ username: username })
    console.info(users[0])
    if (!users.length) {
      return ctx.body = {
        code: 2,
        message: '用户不存在'
      };
    }
    //
    try {
      const salt = makeSalt(); // 生成加密的盐
      const hash_password = encryptPass(password, salt); //根据盐对密码进行加密处理
      users[0].salt = salt // 新盐
      users[0].hashPassword = hash_password // 赋值新密码
      await UserService.updateUserService( users[0] )
      return ctx.body = {
        code: 0,
        message: '修改成功'
      }
    } catch (e) {
      console.info(e)
      return ctx.body = {
        code: 3,
        message: '注册失败！'
      }
    }
  }
}



