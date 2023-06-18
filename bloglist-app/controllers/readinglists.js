const { ReadingLists, User } = require('../models')
const { tokenExtractor } = require('../util/middleware')

const router = require('express').Router()

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const reading = await ReadingLists.create({
    blogId,
    userId
  })
    res.json(reading)
})

router.put('/:id', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)

  const readingList = await ReadingLists.findByPk(req.params.id)

  const userCorrect = user.id === readingList.userId

  if (readingList && userCorrect) {
    const { read } = req.body
    readingList.read = read
    await readingList.save()
    res.json(readingList)
  } else {
    res.status(404).end()
  }
})

module.exports = router