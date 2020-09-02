import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'
import moment from 'moment';

const Paper: any = sequelize.define('paper', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    // autoIncrement: true, //自增
    comment: '唯一标识论文，如果来自 arXiv 或 Acemap 则使用其 ID，若用户上传则随机'
  },
  userId: {
    type: Sequelize.STRING,
    comment: '上传论文的用户Id'
  },
  authors: {
    type: Sequelize.STRING,
    comment: '论文的作者们'
  },
  type: {
    type: Sequelize.STRING,
    comment: '见 PaperTypes'
  },
  citedPapers: {
    type: Sequelize.STRING(500),
    comment: '引用的论文'
  },
  tags: {
    type: Sequelize.STRING(500),
    comment: '标签'
  },
  conference: {
    type: Sequelize.STRING(500),
    comment: '会议'
  },
  journal: {
    type: Sequelize.STRING(500),
    comment: '期刊'
  },
  version: {
    type: Sequelize.STRING,
    comment: '论文版本，多见于 arXiv 论文'
  },
  link: {
    type: Sequelize.STRING(500),
    comment: '论文的 URL'
  },
  title: {
    type: Sequelize.STRING(500),
    comment: '论文题目'
  },
  updated: {
    type: Sequelize.DATE,
    comment: '上次更新的时间戳',
    get() {
      return moment(this.getDataValue('updated')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  published: {
    type: Sequelize.DATE,
    comment: '初次发表的时间戳',
    get() {
      return moment(this.getDataValue('published')).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  pdfLink: {
    type: Sequelize.STRING,
    comment: 'PDF 链接'
  },
  description: {
    type: Sequelize.STRING(1000),
    comment: '摘要'
  },
  thumbs: {
    type: Sequelize.STRING,
    comment: '缩略图 URL'
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
export default Paper
