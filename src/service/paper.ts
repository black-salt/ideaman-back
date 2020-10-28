import Models from '../model/index'

// 论文 新增的接口类型
interface PaperInterface {
  id?: number,
  userId: string,
  authors: string,
  type: string,
  citedPapers?: string,
  tags?: string,
  conference?: string,
  journal?: string,
  version?: string,
  link?: string,
  title?: string,
  updated?: Date,
  published?: Date,
  pdf_link?: string,
  description?: string,
  thumbs?: string,
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

export { PaperInterface }

// 论文 修改的接口类型
interface PaperUpdateInterface {
  id: number,
  authors: string,
  citedPapers?: string,
  tags?: string,
  conference?: string,
  journal?: string,
  version?: string,
  link?: string,
  title?: string,
  updated?: Date,
  published?: Date,
  pdf_link?: string,
  description?: string,
  thumbs?: string,
  addTime?: Date,
  updateTime?: Date,
  deleted?: number
}

// 论文信息 的接口类型
interface PaperInfoInterface {
  id?: number,
  deleted?: number
}

/**
 * @description: 论文Service层类
 */
class PaperService {
  /**
   * @description: 获取PaperList
   * @param  
   * @return: Promise
   */
  static getPaper<T>(data: PaperInfoInterface): Promise<T> {
    if (data.id) {
      return Models.Paper.findAll({
        where: { id: data.id, 
          // deleted: 0 
        }
      })
    } else {
      return Models.Paper.findAll({
        limit: 10,
        // where: { deleted: 0 }
      })
    }
  }

  /**
   * @description: 获取 PaperList, by libraryPaper
   * @param  
   * @return: Promise
   */
  static getPaperByPaperIds<T>(data: Array<number>): Promise<T> {
    return Models.Paper.findAll({
      where: {
        id: {
          $in: data,
        }
      }
    })
  }
  /**
   * @description: 获取 PaperList, by libraryPaper
   * @param  
   * @return: Promise
   */
  static getPaperByLibraryPaper<T>(data: Array<string>): Promise<T> {
    return Models.Paper.findAll({
      where: {
        id: {
          $in: data,
          // deleted: 0
        }
      }
    })
  }

  /**
   * @description: 获取 count
   * @param  
   * @return: Promise
   */
  static getCount<T>(): Promise<T> {
    return Models.Paper.count({
      where: { 
        // deleted: 0 
      }
    })
  }

  /**
   * @description:新增论文,返回一个Promise
   * @param PaperInterface
   * @return: Promise
   */
  static makeNewPaper<T>(data: PaperInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.userId || !data.authors || !data.type) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const nowDate = new Date(); //当前时间

        const {
          userId, authors, type, citedPapers, conference,
          journal, version, link, title, updated, published,
          pdf_link, description, thumbs
        } = data
        resolve(
          Models.Paper.create(
            {
              userId, authors, type, citedPapers, conference,
              journal, version, link, title, updated, published,
              pdf_link, description, thumbs,
              addTime: nowDate, updateTime: nowDate
            },
            // { include: [Models.Category, Models.Tag] } // 这里的是栗子
          ))
      }
    })
  }

  /**
   * @description: 修改论文,返回一个Promise
   * @param PaperInterface
   * @return: Promise
   */
  static updatePaperService<T>(data: PaperUpdateInterface): Promise<T> {
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
            id, authors, citedPapers, conference,
            journal, version, link, title, updated, published,
            pdf_link, description, thumbs,
          } = data
          resolve(
            Promise.all([
              Models.Paper.update({
                authors, citedPapers, conference,
                journal, version, link, title, updated, published,
                pdf_link, description, thumbs,
                updateTime: nowDate
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
   * @description: 删除论文接口,接收一个id
   * @param PaperIdInterface
   * @return: Promise
   */
  static deletePaperService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        const nowDate = new Date(); //当前时间

        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.Paper.update({ updateTime: nowDate, deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default PaperService