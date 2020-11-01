import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const Realtime: any = sequelize.define('realtime', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    comment: 'userID'
  }, 
  userId: {
    type: Sequelize.STRING,
    comment: 'userID'
  },
  recs: {
    type: Sequelize.STRING,
    comment: '推荐列表'
  },
  timestamp: {
    type: Sequelize.STRING,
    comment: '实时推荐结果时间'
  },
})
export default Realtime
