const Blog = require('./blog')
const User = require('./user')
const ReadingLists = require('./readinglists')

Blog.belongsToMany(User, { through: ReadingLists, as: 'readinglists' })
User.belongsToMany(Blog, { through: ReadingLists, as: 'readings' })

module.exports = {
  Blog, User, ReadingLists
}