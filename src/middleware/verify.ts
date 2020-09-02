import jsonWebToken from 'jsonwebtoken'
import log from '../common/logger'
import { app as config } from '../config';
import { MiddleWare } from '@/type';

// 验证token
const verify: MiddleWare = (path: string, isVerify: boolean) => async (ctx, next) => {
  // 签发Token, 并添加到header中
  ctx.sign = (payload: { uid: string; email: string }, exp: number) => {
    // jsonWebToken.sign(payload, secret, options)
    const token = jsonWebToken.sign(payload, config.secret, { expiresIn: exp || config.exp });
    // Bearer代表Authorization头定义的schema, Bearer令牌通过OAuth 2.0保护资源,
    // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Authentication
    // Bearer 就是持令牌人的意思 
    ctx.set('Authorization', `Bearer ${token}`);
  };
  // 需要验证 并且 当前路由的
  if (isVerify && path === ctx.path) {
    // 
    if (!ctx.header || !ctx.header.authorization) {
      ctx.status = 403;
      ctx.body = { code: 3, message: 'Authorization not exist' };
    } else {
      // 获取到 token并将 Bearer 与真正的加密token 分开
      const parts = ctx.header.authorization.split(' ');
      // 获取到真正的加密token
      const credentials = parts.slice(-1)[0];
      try {
        // 调用jsonwebtoken的verify API将 userId等加密信息解密到 ctx.state.token上
        ctx.state.token = await jsonWebToken.verify(credentials, config.secret);
        await next();
      } catch (err) {
        //验证不通过的三种类型 name: 
        // TokenExpiredError(过期) | JsonWebTokenError(token解释错误) | NotBeforeError(还未到生效期)
        err.url = ctx.url;
        log.error(err);
        ctx.status = 403;
        ctx.body = { code: 3, err, message: 'Authorization fail' };
      }
    }
  } else {
    await next();
  }
};

export default verify;