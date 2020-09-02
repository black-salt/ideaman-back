import Models from '../model/index'

// 论文类型 新增的接口类型
interface PaperTypeInterface {
  id?: number,
  type?: string,
  description?: string,
  deleted?: number
}

// 论文类型 修改的接口类型
interface PaperTypeUpdateInterface {
  id?: number,
  type?: string,
  description?: string,
  deleted?: number
}

// 论文类型信息 的接口类型
interface PaperTypeInfoInterface {
  id?: string,
  type?: string,
  description?: string,
}

/**
 * @description: 论文类型Service层类
 */
class PaperTypeService {

  /**
   * @description: 获取PaperType 部分Info
   * @param  
   * @return: Promise
   */
  static getPaperTypeInfo<T>(data: PaperTypeInfoInterface): Promise<T> {
    if (data.id) {
      return Models.PaperType.findAll({
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.PaperType.findAll({
        where: { deleted: 0 }
      })
    }
  }
  /**
   * @description: 获取PaperTypeList
   * @param  
   * @return: Promise
   */
  static getPaperType<T>(data: PaperTypeInfoInterface): Promise<T> {
    if (data.id) {
      return Models.PaperType.findAll({
        where: { id: data.id, type: data.type, deleted: 0 }
      })
    } else {
      return Models.PaperType.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取paperType count
   * @param  
   * @return: Promise
   */
  static getCount<T>(data: { type?: string }): Promise<T> {
    return Models.PaperType.count({
      where: { type: data.type, deleted: 0 }
    })
  }

  /**
   * @description:新增论文类型,返回一个Promise
   * @param PaperTypeInterface
   * @return: Promise
   */
  static makeNewPaperType<T>(data: PaperTypeInterface): Promise<T> {
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
          Models.PaperType.create(
            {
              id, type, description
            },
            // { include: [Models.Category, Models.Tag] } // 这里的是栗子
          ))
      }
    })
  }

  /**
   * @description: 修改论文类型,返回一个Promise
   * @param PaperTypeInterface
   * @return: Promise
   */
  static updatePaperTypeService<T>(data: PaperTypeUpdateInterface): Promise<T> {
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
              Models.PaperType.update({
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
   * @description: 删除论文类型接口,接收一个id
   * @param PaperTypeIdInterface
   * @return: Promise
   */
  static deletePaperTypeService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        const nowDate = new Date(); //当前时间

        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.PaperType.update({ updateTime: nowDate, deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default PaperTypeService