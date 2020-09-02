/** 
 * @description /register 接口 测试用例
 * @author LSKReno
 */

const server = require('./server')

test(`register数据格式返回正确`,
  async () => {
    // const res = await server.post('/login').send({
    //   username: '',
    //   password: ''
    // })
    const res = await server.get('/register/json')
    expect(res.body).toEqual({
      code: 0,
      message: '注册成功！'
    })
    expect(res.body.message).toBe('注册成功！')
  })