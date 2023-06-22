const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./readinglists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: ReadingLists, as: 'readinglists' })
User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })

module.exports = {
  Blog, User, ReadingLists, Session
}