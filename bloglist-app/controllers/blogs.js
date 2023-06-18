const { Op } = require("sequelize")
const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')

const { Blog } = require('../models')
const { User } = require('../models')

router.get('/', async (req, res) => {
  let search
  //console.log(req.query.search)
  if (req.query.search) {
    search = req.query.search
  } else {
    search = ''
  }

  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']],
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where: {
      [Op.or]: [
        {
          title: {
            [Op.iLike]: `%${search}%`
          }
        },
        {
          author: {
            [Op.iLike]: `%${search}%`
          }
        }
      ]
    }
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({
    ...req.body,
    userId: user.id,
    read: false
  })
  res.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const userCorrect = user.id === req.blog.userId

  if (req.blog && userCorrect) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(401).end()
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})

module.exports = router
