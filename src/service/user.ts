import Models from '../model/index'

// 用户 新增的接口类型
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
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

// 用户 修改的接口类型
interface UserUpdateInterface {
  id?: number,
  username: string,
  type: string,
  name?: string,
  email?: string,
  avatar?: string,
  signature?: string,
  status?: number,
  isBlock?: number,
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

// 用户 在线状态修改的接口类型
// interface UserStatusInterface {
//   id: number,
//   status: number
// }

// 登录 的接口类型
interface UserInfoInterface {
  id?: string,
  username?: string
}

/**
 * @description: 用户Service层类
 */
class UserService {

  /**
   * @description: 获取User 部分Info
   * @param  
   * @return: Promise
   */
  static getUserInfo<T>(data: UserInfoInterface): Promise<T> {
    if (data.id) {
      return Models.User.findAll({
        attributes: ['username', 'email', 'name', 'avatar', 'signature'],
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.User.findAll({
        attributes: ['username', 'email', 'name', 'avatar', 'signature'],
        where: { deleted: 0 }
      })
    }
  }
  /**
   * @description: 获取UserList
   * @param  
   * @return: Promise
   */
  static getUser<T>(data: UserInfoInterface): Promise<T> {
    if (data.username) {
      return Models.User.findAll({
        where: { username: data.username, deleted: 0 }
      })
    } else {
      return Models.User.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取username count
   * @param  
   * @return: Promise
   */
  static getCount<T>(data: { username?: string }): Promise<T> {
    return Models.User.count({
      where: { username: data.username, deleted: 0 }
    })
  }

  /**
   * @description:新增用户,返回一个Promise
   * @param UserInterface
   * @return: Promise
   */
  static makeNewUser<T>(data: UserInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.salt || !data.hashPassword || !data.name
        || !data.email || !data.addTime || !data.updateTime) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const {
          username, salt, hashPassword, email, name, type, signature,
          addTime, updateTime
        } = data

        resolve(
          Models.User.create(
            {
              username: username, salt: salt, hashPassword: hashPassword, email: email,
              name: name, type: type, signature: signature,
              addTime: addTime, updateTime: updateTime
            },
            // { include: [Models.Category, Models.Tag] } // 这里的是栗子
          ))
      }
    })
  }

  /**
   * @description: 修改用户,返回一个Promise
   * @param UserInterface
   * @return: Promise
   */
  static updateUserService<T>(data: UserUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {
          const nowDate = new Date(); //当前时间

          const {
            id, email, avatar,
            signature, status, isBlock
          } = data
          resolve(
            Promise.all([
              Models.User.update({
                id, email, avatar, signature, status,
                isBlock, updateTime: nowDate
              }, { where: { id: id } }),
            ]).then((res: any) => {
              resolve(res)
            }).catch((err: Error) => {
              reject(err)
            })
          )
        }
      }
    })
  }
  /**
   * @description: 删除用户接口,接收一个id
   * @param UserIdInterface
   * @return: Promise
   */
  static deleteUserService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        const nowDate = new Date(); //当前时间

        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.User.update({ updateTime: nowDate, deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default UserService