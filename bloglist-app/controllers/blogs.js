const { Op } = require("sequelize")
const router = require('express').Router()
const { tokenExtractor, userValidator } = require('../util/middleware')

const { Blog, User } = require('../models')

router.get('/', async (req, res) => {
  let search

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
      as: 'readinglists',
      attributes: ['name'],
      through: {
        attributes: [ 'id', 'read']
      }
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

router.post('/', tokenExtractor, userValidator, async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    userId: req.user.id,
    read: false
  })
  res.json(blog)
})

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

router.delete('/:id', tokenExtractor, userValidator, blogFinder, async (req, res) => {
  const userCorrect = req.user.id === req.blog.userId

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
