/** 
 * @description 连接redis的方法 get set
 * @author LSKReno
*/

const redis = require('redis')
import { REDIS_CONF } from '../config/index'
import log from '../common/logger'

// 创建客户端
const redisClient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)

redisClient.on('error', (err: any) => {
  log.error('redis error: ' + err);
})

/**
 * set
 * @param key 
 * @param value 
 * @param timeout 
 */
export function set(key: string, value: string, timeout = 60 * 60) {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  redisClient.set(key, value)
  redisClient.expire(key, timeout)
}

/**
 * get
 * @param key 
 */
export function get(key: string) {
  const promise = new Promise((resolve, reject) => {
    redis.Client.get(key, (err: any, value: any) => {
      if (err) {
        reject(err)
        return
      }

      if (value === null) {
        resolve(null)
        return
      }

      try {
        resolve(JSON.parse(value))
      } catch (e) {
        resolve(value)
      }
    })
  })
  return promise
}





