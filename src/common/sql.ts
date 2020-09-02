
import chalk from 'chalk'
import { Sequelize } from 'sequelize'
import { db as dbConfig } from '../config/index'

const sequelize = new Sequelize(
  //库-账号-密码
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  //连接配置
  {
    dialect: 'mysql', // sequelize 不止可以操作 mysql，所以需要指定下
    host: dbConfig.host,
    port: dbConfig.port,
    pool: {
      max: 50,                  // 最大值
      min: 5,                   // 最小值
      acquire: 30000,           //
      idle: 10000               // 闲时超时，如果一个连接池 10s 之内没有被使用则超时
    },
    define: {
      underscored: true, // 默认为false，字段是驼峰命名，开启后是下划线转换
      freezeTableName: true,// 默认为false，表名会在后面加s，开启后定义的表名是什么就是什么
      timestamps: false
    },
    timezone: '+08:00', //for writing to database
    // 没有数据库是否创建
    sync: { force: true }
  }
)
//连接测试
sequelize.authenticate().then(() => {
  console.log(`\n${chalk.green(`${dbConfig.host}:${dbConfig.port}-MySQL的${dbConfig.database}数据库连接成功`)}\n`)
}).catch((err: any) => {
  console.log(err)
  console.log(`\n${chalk.red(`${dbConfig.host}:${dbConfig.port}-MySQL的${dbConfig.database}数据库连接失败`)}\n`)
})
export default sequelize