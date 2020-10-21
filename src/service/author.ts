import Models from '../model/index'

// 论文类型 新增的接口类型
interface AuthorInterface {
  id?: number,
  author?: string
}

/**
 * @description: 论文类型Service层类
 */
class AuthorService {

  /**
   * @description: 获取Author
   * @param  
   * @return: Promise
   */
  static getAuthor<T>(data: AuthorInterface): Promise<T> {
    if (data.id) {
      return Models.Author.findAll({
        where: { id: data.id }
      })
    } else {
      return Models.Author.findAll()
    }
  }

  /**
   * @description: 获取AuthorList
   * @param  
   * @return: Promise
   */
  static getAuthorList<T>(data: Array<number>): Promise<T> {
    return Models.Paper.findAll({
      where: {
        id: {
          $in: data,
        }
      }
    })
  }
}

export default AuthorService