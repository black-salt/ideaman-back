import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'
import moment from 'moment';

const User: any = sequelize.define('user', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    autoIncrement: true, //自增
    comment: '自增ID'
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false, //不允许为空
    comment: '用户名（全站唯一），主键，唯一'
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false, //不允许为空
    comment: '用户类型（见UserTypes）'
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false, //不允许为空
    comment: '姓名'
  },
  salt: {
    type: Sequelize.STRING(13),
    allowNull: false, //不允许为空
    comment: '加密的盐'
  },
  hashPassword: {
    type: Sequelize.STRING(64),
    allowNull: false,//不允许为空
    comment: '加密后的密码'
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,//不允许为空
    comment: 'email地址'
  },
  avatar: {
    type: Sequelize.STRING,
    defaultValue: 'https://halftown.oss-cn-beijing.aliyuncs.com/user/avatar/nono.jpg',
    comment: '头像'
  },
  signature: {
    type: Sequelize.STRING,
    defaultValue: 'Idea Man',
    comment: '个性签名'
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
    comment: '状态(0 离线 1 在线 2 隐身)'
  },
  isBlock: {
    type: Sequelize.TINYINT,
    defaultValue: 0, //默认为 0，即不禁用
    comment: '是否是禁用(0 不是 1 是)'
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
export default User
