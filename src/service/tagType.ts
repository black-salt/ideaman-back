import Models from '../model/index'

// 标签类型 新增的接口类型
interface TagTypeInterface {
    id?: number,
    tagTypeName: string,
    description?: string,
    deleted?: number
}

// 标签类型 修改的接口类型
interface TagTypeUpdateInterface {
    id: number,
    tagTypeName?: string,
    description?: string,
    deleted?: number
}

// 标签类型信息 的接口类型
interface TagTypeInfoInterface {
    id?: number,
    tagTypeName?: string,
    description?: string,
}

/**
 * @description: 标签类型Service层类
 */
class TagTypeService {

  /**
   * @description: 获取TagType
   * @param  
   * @return: Promise
   */
  static getTagTypeInfo<T>(data: TagTypeInfoInterface): Promise<T> {
    if (data.id) {
      return Models.TagType.findAll({
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.TagType.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description:新增标签类型,返回一个Promise
   * @param TagTypeInterface
   * @return: Promise
   */
  static makeNewTagType<T>(data: TagTypeInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.tagTypeName || !data.description) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const {
          tagTypeName, description
        } = data
        resolve(
          Models.TagType.create(
            {
              tagTypeName, description
            },
          ))
      }
    })
  }

  /**
   * @description: 修改标签类型,返回一个Promise
   * @param TagTypeInterface
   * @return: Promise
   */
  static updateTagTypeService<T>(data: TagTypeUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {

          const {
            id,tagTypeName, description
          } = data
          resolve(
            Promise.all([
              Models.TagType.update({
                id,tagTypeName, description
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
   * @description: 删除标签类型接口,接收一个id
   * @param TagTypeIdInterface
   * @return: Promise
   */
  static deleteTagTypeService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.TagType.update({deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default TagTypeService