// This section describes the various association types in sequelize. 
// There are four type of associations available in Sequelize
// BelongsTo
// HasOne
// HasMany
// BelongsToMany

import User from './user';
import UserType from './userType';
import Paper from './paper';
import PaperType from './paperType';
import LibraryPaper from './libraryPaper';

import Team from './team';
import Advice from './advice';

// hasMany, belongsTo 是外键关联的相关方法
// Article.hasMany(Category)
// Article.hasMany(Tag)
// Category.belongsTo(Article)
// Tag.belongsTo(Article)

User.sync()
UserType.sync()
Paper.sync()
PaperType.sync()
LibraryPaper.sync()
Team.sync()
Advice.sync()

export default { User, UserType, Paper, PaperType, LibraryPaper, Team, Advice }