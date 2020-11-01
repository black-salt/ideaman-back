import Models from '../model/index'

interface RealtimePaperInterface {
  id?: number,
  userId?: string,
  recs?: string,
  timestamp?: string,
}

export { RealtimePaperInterface }

/**
 * @description: 实时推荐论文Service层类
 */
class RealtimePaperService {
  /**
   * @description: 获取RealtimePaperList
   * @param  
   * @return: Promise
   */
  static getRealTimePaper<T>(data: RealtimePaperInterface): Promise<T> {
    return Models.Realtime.findAll({
      where: {
        userId: data.userId
      },
      order: [['timestamp', 'DESC']] ,
      limit: 2
    })
  }
}

export default RealtimePaperService