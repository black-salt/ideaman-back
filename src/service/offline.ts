import Models from '../model/index'

interface OfflinePaperInterface {
  paperId?: number,
  recs?: string,
}

export { OfflinePaperInterface }

/**
 * @description: 离线推荐论文Service层类
 */
class OfflinePaperService {
  /**
   * @description: 获取OfflinePaperList
   * @param  
   * @return: Promise
   */
  static getRelatedPaper<T>(data: OfflinePaperInterface): Promise<T> {
    return Models.OfflinePaper.findAll({
      where: {
        paperId: data.paperId
      }
    })
  }

}

export default OfflinePaperService