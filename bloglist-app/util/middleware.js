const jwt = require('jsonwebtoken')

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const errorHandler = (error, req, res, next) => {
  res.status(400).send({ error: error.message })

  next(error)
}

const userValidator = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user.disabled) {
    return res.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const session = await Session.findOne({ where: { userId: user.id } })

  if (!session) {
    return res.status(401).json({
        error: 'session inactive'
      })
  }

  req.user = user

  next()
}

module.exports = {
  errorHandler,
  tokenExtractor,
  userValidator
}