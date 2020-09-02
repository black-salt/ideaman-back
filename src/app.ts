import path from 'path'
import http from 'http'
import koa from 'koa'
import logger from 'koa-logger'
import koaStatic from 'koa-static'
import compress from 'koa-compress'
import cors from 'koa2-cors'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import favicon from 'koa-favicon'
import socket from 'socket.io'

import { app as config } from './config'
import log from './common/logger'
import addRouter from './router/router'
import addSocket from './socket'
import tpl from './middleware/tpl'
import errorHandler from './middleware/error'

const app = new koa()

const router = new koaRouter();
const server = http.createServer(app.callback())
const socketServer = socket(server)
const baseDir = path.normalize(__dirname + '/..')

// gzip
app.use(compress({
  filter: function (content_type) {
    return /text|javascript/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}));

// display access records
app.use(logger());

// session

// parse request
app.use(koaBody({
  jsonLimit: 1024 * 1024 * 5,
  formLimit: 1024 * 1024 * 5,
  textLimit: 1024 * 1024 * 5,
  multipart: true, // 解析FormData数据
  strict: false, //设为false, 如果不设为false，则使用koa-body的时候，使用GET,HEAD,DELETE请求时,request.body中的内容为空对象{}
  formidable: { uploadDir: path.join(baseDir, 'public/upload') }
}));

// set static directory
app.use(koaStatic(path.join(baseDir, 'public'), { index: false }));
app.use(favicon(path.join(baseDir, 'public/favicon.jpg')));

//cors
app.use(cors({
  origin: config.client,// 如果为*就是通配，写明详细url才行, 这是允许访问接口的客户端地址，就是允许跨域访问的客户端地址
  credentials: true, //将凭证暴露出来, 前端才能获取cookie
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  exposeHeaders: ['Authorization'], // 将header字段expose出去，前端才能获取该header字段
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'] // 允许添加到header的字段
}));

// set template engine
app.use(tpl({ path: baseDir + '/public' }));

// handle the error
app.use(errorHandler());

// add route
addRouter(router);
app.use(router.routes()).use(router.allowedMethods());

// deal 404
app.use(async ctx => {
  log.error(`404 ${ctx.message} : ${ctx.href}`);
  ctx.status = 404;
  ctx.body = '404! page not found !';
  // ctx.render('404.html');
});

// koa already had middleware to deal with the error, just register the error event
app.on('error', (err, ctx) => {
  log.error(err);//log all errors
  ctx.status = 500;
  ctx.statusText = 'Internal Server Error';
  if (ctx.app.env === 'development') { //throw the error to frontEnd when in the develop mode
    ctx.res.end(err.stack); //finish the response
  } else {
    ctx.render('Server Error');
  }
});

if (!module.parent) {
  let { port, socketPort } = config;
  //如果是pm2 cluster模式
  const instance = process.env.NODE_APP_INSTANCE;
  if (instance) {
    socketPort += parseInt(instance, 10);
  }

  /**
   * koa app
   */
  app.listen(port);
  // http.createServer(app.callback()).listen(port);// does the same like: app.listen(port)
  log.info(`=== app server running on port ${port}===`);
  console.info('\n app server running at: http://localhost:%d \n', port);

  /**
   * socket.io
   */
  addSocket(socketServer);
  server.listen(socketPort);
  log.info(`=== socket listening on port ${socketPort} ===`)
  console.info('socket server running at: http://localhost:%d \n', socketPort);
}

module.exports = app;