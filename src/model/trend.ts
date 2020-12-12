import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const Trend: any = sequelize.define('trend', {
  // 表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  trend_name: {
    type: Sequelize.STRING,
    allowNull: false,
    comment: '趋势名称'
  },
  trend_echo_url: {
    type: Sequelize.STRING,
    comment: '趋势图片url'
  },
  description: {
    type: Sequelize.STRING,
    comment: '描述'
  },
  deleted: {
    type: Sequelize.INTEGER,
    allowNull: false,//不允许为空
    defaultValue: 0, //默认为 0，即未激活
    comment: '逻辑激活(0 未激活 1 已激活)'
  }
})
export default Trend