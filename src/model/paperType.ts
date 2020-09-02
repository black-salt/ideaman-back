import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const PaperType: any = sequelize.define('paper_type', {
  // 表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  type: {
    type: Sequelize.STRING,
    comment: '论文类型(来自 arXiv,用户自己上传,来自 Acemap)'
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
export default PaperType
