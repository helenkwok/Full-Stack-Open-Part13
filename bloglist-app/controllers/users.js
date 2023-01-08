const bcrypt = require('bcrypt')
const router = require('express').Router()

const { Blog } = require('../models')
const { User } = require('../models')
const { SECRET, SALT_ROUNDS } = require('../util/config')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['passwordHash'] },
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const user = await User.create({
    username,
    name,
    passwordHash,
  })
    res.json(user)
})

router.put('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    },
    attributes: { exclude: ['passwordHash'] }
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