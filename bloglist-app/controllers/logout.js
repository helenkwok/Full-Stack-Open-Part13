const router = require('express').Router()
const { tokenExtractor, userValidator } = require('../util/middleware')

const { Session, User } = require('../models')

router.delete('/', tokenExtractor, userValidator, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  await Session.destroy({
    where: {
      userId: user.id
    }
  })

  return res.status(200).end()
})

module.exports = router