const bcrypt = require('bcrypt')
const router = require('express').Router()
const { Op } = require('sequelize')

const { Blog, User } = require('../models')
const { SALT_ROUNDS } = require('../util/config')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [ 'id', 'read']
        }
      }
    ]
  })
  res.json(users)
})

router.get('/:id', async (req, res) => {
  let where = {}

  if (req.query.read) {
    where.read = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    include: [
      {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
        through: {
          attributes: [ 'id', 'read'],
          where
        }
      }
    ]
  })
  res.json(user)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({
    username,
    name,
    passwordHash
  })
    res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    },
    attributes: { exclude: ['password_hash'] }
  })
  if (user) {
    user.username = req.body.username
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router