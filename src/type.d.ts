import { Context, Next } from 'koa'

type ResData = {
  code: number;
  message?: string;
  data?: any;
  err?: any;
}

// type PlainObject = { [P: string]: any };
type PlainObject = Record<string, any>;
type MysqlResult = {
  affectedRows?: number;
  insertId?: string;
} | PlainObject

type RouteMeta = {
  name: string; // 路由对应调用的方法
  method: string; // 请求方法啊
  path: string; // 
  isVerify: boolean;// 
}

type MiddleWare = (...arg: any[]) => (ctx: Context, next?: Next) => Promise<void>;

export {
  ResData,
  MysqlResult,
  PlainObject,
  RouteMeta,
  MiddleWare,
}