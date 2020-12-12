import Models from '../model/index'

// 用户类型 新增的接口类型
interface LibraryPaperInterface {
  id?: number,
  userId?: string,
  paperId?: string,
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

export { LibraryPaperInterface }

// 用户类型 修改的接口类型
interface LibraryPaperUpdateInterface {
  id?: number,
  userId?: string,
  paperId?: string,
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

// 用户类型信息 的接口类型
interface LibraryPaperInfoInterface {
  id?: number,
  deleted?: number
}

/**
 * @description: 用户类型Service层类
 */
class LibraryPaperService {

  /**
   * @description: 获取LibraryPaper 部分Info
   * @param  
   * @return: Promise
   */
  static getLibraryPaperInfo<T>(data: LibraryPaperInfoInterface): Promise<T> {
    if (data.id) {
      return Models.LibraryPaper.findAll({
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.LibraryPaper.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取LibraryPaperList
   * @param  
   * @return: Promise
   */
  static getLibraryPaperByUser<T>(data: { uid?: string }): Promise<T> {
    if (data.uid) {
      return Models.LibraryPaper.findAll({
        where: { userId: data.uid, deleted: 0 }
      })
    } else {
      return Models.LibraryPaper.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取libraryPaper count
   * @param  
   * @return: Promise
   */
  static getCount<T>(data: { paperId?: string }): Promise<T> {
    return Models.LibraryPaper.count({
      where: { type: data.paperId, deleted: 0 }
    })
  }

  /**
   * @description:新增用户类型,返回一个Promise
   * @param LibraryPaperInterface
   * @return: Promise
   */
  static makeNewLibraryPaper<T>(data: LibraryPaperInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.userId || !data.paperId) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const nowDate = new Date(); //当前时间

        const {
          userId, paperId
        } = data
        resolve(
          Models.LibraryPaper.create(
            {
              userId, paperId,
              addTime: nowDate, updateTime: nowDate,
              deleted: 0
            },
            // { include: [Models.Category, Models.Tag] } // 这里的是栗子
          ))
      }
    })
  }

  /**
   * @description: 更新library中记录，就是把已删除变成未删除，业务里不会有其他修改
   * @param LibraryPaperInterface
   * @return: Promise
   */
  static updateLibraryPaperService<T>(data: LibraryPaperUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.paperId || !data.userId) {
        reject('缺少参数错误')
      } else {
        //没懂，暂时放着，也不会有问题
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {
          const {userId, paperId} = data
          resolve(
            //为什么要all，暂时放着，反正也对
            Promise.all([
              Models.LibraryPaper.update({
                deleted:0
              }, { where: { userId:userId, paperId:paperId } }),
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
   * @param LibraryPaperIdInterface
   * @return: Promise
   */
  static deleteLibraryPaperService<T>(data: { paperId: string, userId: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.paperId) {
        reject('参数错误')
      } else {
        const nowDate = new Date(); //当前时间
        Promise.all([
          Models.LibraryPaper.update({ updateTime: nowDate, deleted: 1 }, { where: { paperId: data.paperId, userId: data.userId, deleted: 0 } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  /**
   * @description: , 返回一个 Promise
   * @param LibraryPaperInterface
   * @return: Promise
   */
  static isLibraryPaper<T>(data: LibraryPaperInterface): Promise<T> {
    // 判断这些参数是否存在
    if (!data.userId || !data.paperId) {
      return Promise.reject('缺少参数错误，请检查！')
    }
    else {
      const {
        userId, paperId
      } = data
      return Models.LibraryPaper.count({
        where: { userId: userId, paperId: paperId, deleted: 0 }
      })
    }
  }

}

export default LibraryPaperService