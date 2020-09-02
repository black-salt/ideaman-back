import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'
import moment from 'moment';

const Team: any = sequelize.define('team', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  memberId: {
    type: Sequelize.STRING(50),
    allowNull: false, //不允许为空
    comment: '团队成员id'
  },
  realName: {
    type: Sequelize.STRING(50),
    comment: '真实姓名'
  },
  nickname: {
    type: Sequelize.STRING(50),
    comment: '昵称'
  },
  avatar: {
    type: Sequelize.STRING(2550),
    defaultValue: 'https://halftown.oss-cn-beijing.aliyuncs.com/user/avatar/nono.jpg',
    comment: '头像'
  },
  description: {
    type: Sequelize.STRING(2550),
    comment: '描述'
  },
  tags: {
    type: Sequelize.STRING(255),
    comment: '标签'
  },
  addTime: {
    type: Sequelize.DATE,
    allowNull: false,//不允许为空
    comment: '注册时间',
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
export default Team
