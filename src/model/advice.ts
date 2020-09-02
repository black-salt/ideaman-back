import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'
import moment from 'moment';

const Advice: any = sequelize.define('advice', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false, //不允许为空
    comment: '用户id'
  },
  content: {
    type: Sequelize.STRING(2550),
    comment: '吐槽内容'
  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    comment: '处理状态(0表示未处理，1表示已上报并处理中，2表示处理完毕)'
  },
  addTime: {
    type: Sequelize.DATE,
    allowNull: false,//不允许为空
    comment: '添加时间',
    get() {
      return moment(this.getDataValue('addTime')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  updateTime: {
    type: Sequelize.DATE,
    allowNull: false,//不允许为空
    comment: '更新时间',
    get() {
      return moment(this.getDataValue('updateTime')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  deleted: {
    type: Sequelize.TINYINT,
    allowNull: false,//不允许为空
    defaultValue: 0, //默认为 0，即未删除
    comment: '逻辑删除(0 未删除 1 已删除)'
  }
})
export default Advice
