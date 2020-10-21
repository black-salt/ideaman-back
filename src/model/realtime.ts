import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const Realtime: any = sequelize.define('realtime', {
  //表id
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    comment: 'userID'
  },
  recs: {
    type: Sequelize.STRING,
    comment: '推荐列表'
  },
})
export default Realtime
