import sequelize from '../common/sql'
import * as Sequelize from 'sequelize'

const Author: any = sequelize.define('authors', {
  //表id
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true, //主键
    comment: 'ID'
  },
  author: {
    type: Sequelize.STRING,
    comment: '作者名称'
  },
})
export default Author
