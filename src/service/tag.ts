import Models from '../model/index'

// 标签 新增的接口类型
interface TagInterface {
    id?: number,
    tagName: string,
    tagImageUrl: string,
    tagTypeId: number,
    tagFollowerNum?: number,
    tagPaperNum?: number,
    deleted?: number
}

// 标签 修改的接口类型
interface TagUpdateInterface {
    id?: number,
    tagName?: string,
    tagImageUrl?: string,
    tagTypeId?: number,
    tagFollowerNum?: number,
    tagPaperNum?: number,
    deleted?: number
}

// 标签信息 的接口类型
interface TagInfoInterface {
    id?: number,
    tagName?: string,
    tagImageUrl?: string,
    tagTypeId?: number,
    tagFollowerNum?: number,
    tagPaperNum?: number,
    deleted?: number
}

/**
 * @description: 标签Service层类
 */
class TagService {

  /**
   * @description: 获取Tag。因为一个tag可以属于多个tagType，所以一个tagName下有多条记录。返回一个该tagName的数组
   * @param  
   * @return: Promise
   */
  static getTagRecordList<T>(data: TagInfoInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function)=>{
      if (data.tagName) {
        resolve(Models.Tag.findAll({
          where: { tagName: data.tagName, deleted: 0 }
        }))
      }else {
        reject('缺少tagName参数')
      }
    })
  }

  /**
   * @description: 获取某个TagType下的所有tag
   * @param  
   * @return: Promise
   */
  static getTagsByType<T>(data: TagInfoInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function)=>{
      if (data.tagTypeId) {
        resolve(Models.Tag.findAll({
          where: { tagTypeId: data.tagTypeId, deleted: 0 }
        }))
      }else {
        reject('缺少tagTypeId参数')
      }
    })
  }

  /**
   * @description:新增一个tag的一条记录,返回一个Promise
   * @param TagInterface
   * @return: Promise
   */
  static makeNewTagRecord<T>(data: TagInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.tagName || !data.tagTypeId) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const {
          tagName, tagImageUrl, tagTypeId, tagFollowerNum, tagPaperNum
        } = data
        resolve(
          Models.Tag.create(
            {
              tagName, tagImageUrl, tagTypeId, tagFollowerNum, tagPaperNum
            },
          ))
      }
    })
  }

  /**
   * @description: 修改一个标签名下的所有记录,返回一个Promise，用来更新name或follownum或papernum或imageurl
   * @param TagInterface
   * @return: Promise
   */
  static updateTagRecordByName<T>(data: TagUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.tagName) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {

          const {
            tagName, tagImageUrl,tagFollowerNum, tagPaperNum
          } = data
          resolve(
            Promise.all([
              Models.Tag.update({
                tagName, tagImageUrl,tagFollowerNum, tagPaperNum
              }, { where: { tagName: tagName } }),
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
   * @description: 修改一个标签名下的一条记录,返回一个Promise，可以用来更新tagType
   * @param TagInterface
   * @return: Promise
   */
  static updateTagRecordById<T>(data: TagUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {

          const {
            id, tagName, tagImageUrl,tagFollowerNum, tagPaperNum
          } = data
          resolve(
            Promise.all([
              Models.Tag.update({
                tagName, tagImageUrl,tagFollowerNum, tagPaperNum
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
   * @description: 删除一个标签名下的某条记录,接收一个id，如果这条记录中标签种类不对，就用这个接口
   * @param TagIdInterface
   * @return: Promise
   */
  static deleteTagRecordById<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.Tag.update({deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }

  /**
   * @description: 删除一个标签名下的所有记录,接收一个tagName, 如果不需要这个标签了，就用这个接口
   * @param TagIdInterface
   * @return: Promise
   */
  static deleteTagRecordByName<T>(data: { tagName: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.tagName) {
        reject('参数错误')
      } else {
        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.Tag.update({deleted: deletedTag }, { where: { tagName: data.tagName } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default TagService