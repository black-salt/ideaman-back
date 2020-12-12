import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const Tag: any = sequelize.define('tag', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  type_name: {
    type: Sequelize.STRING,
    allowNull: false, //不允许为空
    comment: '标签名称'
  },
  type_image_url: {
    type: Sequelize.STRING,
    comment: '标签图片url'
  },
  tag_type_id: {
    type: Sequelize.INTEGER,
    allowNull: false,//不允许为空
    comment: '标签种类ID'
  },
  tag_follower_num: {
    type: Sequelize.INTEGER,
    comment: '标签的关注数量'
  },
  tag_paper_num: {
    type: Sequelize.INTEGER,
    comment: '标签下论文数量'
  },
  deleted: {
    type: Sequelize.TINYINT,
    allowNull: false,//不允许为空
    defaultValue: 0, //默认为 0，即未删除
    comment: '逻辑删除(0 未删除 1 已删除)'
  }
})
export default Tag