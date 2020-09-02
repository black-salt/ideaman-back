import Models from '../model/index'

// 用户类型 新增的接口类型
interface UserTypeInterface {
  id?: number,
  type?: string,
  description?: string,
  deleted?: number
}

// 用户类型 修改的接口类型
interface UserTypeUpdateInterface {
  id?: number,
  type?: string,
  description?: string,
  deleted?: number
}

// 用户类型信息 的接口类型
interface UserTypeInfoInterface {
  id?: string,
  type?: string,
  description?: string,
}

/**
 * @description: 用户类型Service层类
 */
class UserTypeService {

  /**
   * @description: 获取UserType 部分Info
   * @param  
   * @return: Promise
   */
  static getUserTypeInfo<T>(data: UserTypeInfoInterface): Promise<T> {
    if (data.id) {
      return Models.UserType.findAll({
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.UserType.findAll({
        where: { deleted: 0 }
      })
    }
  }
  /**
   * @description: 获取UserTypeList
   * @param  
   * @return: Promise
   */
  static getUserType<T>(data: UserTypeInfoInterface): Promise<T> {
    if (data.id) {
      return Models.UserType.findAll({
        where: { id: data.id, type: data.type, deleted: 0 }
      })
    } else {
      return Models.UserType.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取userType count
   * @param  
   * @return: Promise
   */
  static getCount<T>(data: { type?: string }): Promise<T> {
    return Models.UserType.count({
      where: { type: data.type, deleted: 0 }
    })
  }

  /**
   * @description:新增用户类型,返回一个Promise
   * @param UserTypeInterface
   * @return: Promise
   */
  static makeNewUserType<T>(data: UserTypeInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.id || !data.type || !data.description) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const {
          id, type, description
        } = data
        resolve(
          Models.UserType.create(
            {
              id, type, description
            },
            // { include: [Models.Category, Models.Tag] } // 这里的是栗子
          ))
      }
    })
  }

  /**
   * @description: 修改用户类型,返回一个Promise
   * @param UserTypeInterface
   * @return: Promise
   */
  static updateUserTypeService<T>(data: UserTypeUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {

          const {
            id, type, description
          } = data
          resolve(
            Promise.all([
              Models.UserType.update({
                id, type, description
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
   * @description: 删除用户类型接口,接收一个id
   * @param UserTypeIdInterface
   * @return: Promise
   */
  static deleteUserTypeService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        const nowDate = new Date(); //当前时间

        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.UserType.update({ updateTime: nowDate, deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default UserTypeService