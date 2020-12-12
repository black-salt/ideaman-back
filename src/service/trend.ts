import Models from '../model/index'

// 趋势 新增的接口类型
interface TrendInterface {
    id?: number,
    trendName: string,
    trendEchoUrl?: string,
    description?: string,
    deleted?: number
}

// 趋势 修改的接口类型
interface TrendUpdateInterface {
    id: number,
    trendName?: string,
    trendEchoUrl?: string,
    description?: string,
    deleted?: number
}

// 趋势信息 的接口类型
interface TrendInfoInterface {
    id: number,
    trendName?: string,
    trendEchoUrl?: string,
    description?: string,
}

/**
 * @description: 趋势Service层类
 */
class TrendService {

  /**
   * @description: 获取Trend
   * @param  
   * @return: Promise
   */
  static getTrendInfo<T>(data: TrendInfoInterface): Promise<T> {
    if (data.id) {
      return Models.Trend.findAll({
        where: { id: data.id, deleted: 0 }
      })
    } else {
      return Models.Trend.findAll({
        where: { deleted: 0 }
      })
    }
  }

  /**
   * @description:新增趋势,返回一个Promise
   * @param TrendInterface
   * @return: Promise
   */
  static makeNewTrend<T>(data: TrendInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      // 判断这些参数是否存在
      if (!data.trendName || !data.trendEchoUrl || !data.description) {
        reject('缺少参数错误，请检查！')
      }
      else {
        const {
          trendName, trendEchoUrl, description
        } = data
        resolve(
          Models.Trend.create(
            {
              trendName, trendEchoUrl, description
            },
          ))
      }
    })
  }

  /**
   * @description: 修改趋势,返回一个Promise
   * @param TrendInterface
   * @return: Promise
   */
  static updateTrendService<T>(data: TrendUpdateInterface): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('缺少参数错误')
      } else {
        if (Object.keys(data).length === 0) {
          reject('未做出修改')
        }
        else {

          const {
            id,trendName, trendEchoUrl, description
          } = data
          resolve(
            Promise.all([
              Models.Trend.update({
                id,trendName, trendEchoUrl, description
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
   * @description: 删除趋势接口,接收一个id
   * @param TrendIdInterface
   * @return: Promise
   */
  static deleteTrendService<T>(data: { id: string, deleted: string }): Promise<T> {
    return new Promise((resolve: Function, reject: Function) => {
      if (!data.id) {
        reject('参数错误')
      } else {
        let deletedTag = parseInt(data.deleted) ? 0 : 1;
        Promise.all([
          Models.Trend.update({deleted: deletedTag }, { where: { id: data.id } }),
        ]).then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }
    })
  }
}

export default TrendService