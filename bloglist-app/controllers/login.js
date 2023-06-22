const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

router.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const session = await Session.findOne({ where: { userId: user.id } })

  if (session) {
    return res.status(200).send({
      token: session.token,
      username: user.username,
      name: user.name
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  // token expires in 60*60 seconds, that is, in one hour
  const token = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60*60 }
  )

  await Session.create({
    userId: user.id,
    token
  })

  res.status(200).send({
    token,
    username: user.username,
    name: user.name
  })
})

module.exports = router