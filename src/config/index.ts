import { PoolConfig } from 'mysql';

const isDev = process.env.NODE_ENV === 'development'
// const notDev = process.env.NODE_ENV !== 'development'
// const isProd = process.env.NODE_ENV === 'production'
const notProd = process.env.NODE_ENV !== 'production'
// const isTest = process.env.NODE_ENV === 'test'
// const notTest = process.env.NODE_ENV !== 'test'

/**
 * app config
 */
export const app = {
  isDev: isDev,
  // client: notProd ? '*' : 'http://lskreno.top:8409',//允许访问接口的客户端地址，就是允许跨域访问的客户端地址
  client: '*',//允许访问接口的客户端地址，就是允许跨域访问的客户端地址
  // client: 'http://localhost:9082',//允许访问接口的客户端地址，就是允许跨域访问的客户端地址
  // host: notProd ? 'localhost' : 'http://lskreno.top:8408',
  host: 'localhost',
  port: 3000, // koa app 服务器开放的端口
  socketPort: 3010, // socket监听的端口
  secret: 'IdeaMan-JWT-Secret', // JWT_Token_Secret, 小白们别给我泄露啦
  exp: 7 * 24 * 60 * 60, // token有效时间为一周
};

/**
 * mysql database config
 */
export const db: PoolConfig = {
  host: notProd ? 'localhost' : '',
  port: 3306,
  user: 'root',
  password: notProd ? 'lskreno' : 'lskreno*/0',
  database: 'ideaman',
  charset: 'utf8mb4',//utf8mb4才能保存emoji
  multipleStatements: true,// 可同时查询多条语句, 但不能参数化传值
  connectionLimit: 100
};

/**
 * redis database config
 * @description 虽然redis在本项目中并没有用到，但是本项目可以作为一个模板，所以暂时写出来
 * 如果需要使用 redis 则可以执行 `npm install redis --save`
 */
export const REDIS_CONF: PoolConfig = {
  host: notProd ? 'localhost' : 'http://',
  port: 6379
};

/**
 * logger config
 */
export const log4js = {
  // appenders是对各种日志输出形式的定义
  appenders: {
    out: {
      type: 'stdout',
      layout: { type: 'basic' }
    },
    file: {
      type: 'file',
      pattern: '-yyyy-MM-dd.log', //通过日期来生成文件
      alwaysIncludePattern: true, //文件名始终以日期区分
      filename: 'logs/IdeaMan-system.log',
      maxLogSize: 10485760,
      backups: 3,
      compress: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy/MM/dd:hh.mm.ss}] %p %c - %m%n'
      }
    }
  },
  // categories决定了在某种类型输出下调用哪些的appender
  categories: {
    default: {
      appenders: ['file'],
      level: 'info'
    }
  }
};