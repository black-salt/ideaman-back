import 'reflect-metadata'
import fs from 'fs'
import path from 'path'
import verify from '../middleware/verify'
import { ROUTER_MAP } from '../constant/constant'
import { RouteMeta } from '../type'
import Router from 'koa-router'

const addRouter = (router: Router) => {
  const ctrPath = path.join(__dirname, '../controller');
  const modules: ObjectConstructor[] = [];
  // 扫描controller文件夹，收集所有controller文件
  fs.readdirSync(ctrPath).forEach(name => {
    if (/^[^.]+\.(t|j)s$/.test(name)) {
      // 所有 controller 都是一个 module，将这些 module 放到一个数组里面
      // 这些 module 在定义的时候就已经执行了装饰器，所以也会拥有元数据
      modules.push(require(path.join(ctrPath, name)).default)
    }
  });

  // 结合meta数据添加路由 和 验证
  modules.forEach(m => {
    // 每一个 m 都是一个 controller 类，
    // 这个类里面的方法在定义的时候都使用了装饰器并且定义了元数据，
    // 元数据包括 路由对应的方法名称，请求的方法(GET/POST/DELETE/PUT)，对应的请求路径，
    const routerMap: RouteMeta[] = Reflect.getMetadata(ROUTER_MAP, m, 'method') || [];
    // 该 controller 里有路由时
    if (routerMap.length) {
      // new 一个该 controller 的实例
      const ctr = new m();
      // 取出每一个路由
      routerMap.forEach(route => {
        // 解构 路由元数据
        const { name, method, path, isVerify } = route;

        // router 是从 app.ts 传进来的 koa-router实例 
        // verify(path, isVerify) 是在进行 token 的验证，也是将 userId等信息解密到ctx.state.token上
        // ctr[name] 是该controller实例中要执行的方法
        router[method](path, verify(path, isVerify), ctr[name]);
      })
    }
  })
}

export default addRouter