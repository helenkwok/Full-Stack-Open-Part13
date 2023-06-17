const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./reading_lists')

Blog.belongsTo(User)
User.hasMany(Blog)

Blog.belongsToMany(User, { through: ReadingLists, as: 'users_read' })
User.belongsToMany(Blog, { through: ReadingLists, as: 'read_blogs' })

module.exports = {
  Blog, User, ReadingLists
}