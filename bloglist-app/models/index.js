const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./readinglists')

Blog.belongsTo(User)
User.hasMany(Blog)

Blog.belongsToMany(User, { through: ReadingLists, as: 'users_read' })
User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })

module.exports = {
  Blog, User, ReadingLists
}