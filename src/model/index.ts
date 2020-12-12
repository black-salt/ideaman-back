// This section describes the various association types in sequelize. 
// There are four type of associations available in Sequelize
// BelongsTo
// HasOne
// HasMany
// BelongsToMany

import User from './user';
import UserType from './userType';
import Paper from './paper';
import Author from './author';
import PaperType from './paperType';
import LibraryPaper from './libraryPaper';

import Team from './team';
import Advice from './advice';
import Realtime from './realtime';
import OfflinePaper from './offlinePaper';

import Tag from './tag'
import TagType from './tagType'
import Trend from './trend'

// hasMany, belongsTo 是外键关联的相关方法
// Article.hasMany(Category)
// Article.hasMany(Tag)
// Category.belongsTo(Article)
// Tag.belongsTo(Article)

User.sync()
UserType.sync()
Paper.sync()
Author.sync()
PaperType.sync()
LibraryPaper.sync()
Team.sync()
Advice.sync()

Realtime.sync()
OfflinePaper.sync()

Tag.sync()
TagType.sync()
Trend.sync()


export default { User, UserType, Paper, Author, PaperType, LibraryPaper, Team, Advice, Realtime, OfflinePaper, Tag, TagType, Trend }