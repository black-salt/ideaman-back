import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const OfflinePaper: any = sequelize.define('offline_paper', {
  //表id
  paperId: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    comment: 'paperID'
  },
  recs: {
    type: Sequelize.STRING,
    comment: '推荐列表'
  },
})
export default OfflinePaper
