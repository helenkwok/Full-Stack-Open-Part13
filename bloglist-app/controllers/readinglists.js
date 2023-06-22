const { ReadingLists, User } = require('../models')
const { tokenExtractor, userValidator } = require('../util/middleware')

const router = require('express').Router()

router.post('/', tokenExtractor, userValidator, async (req, res) => {
  const { blogId, userId } = req.body

  const reading = await ReadingLists.create({
    blogId,
    userId
  })
    res.json(reading)
})

router.put('/:id', tokenExtractor, userValidator, async (req, res) => {
  const readingList = await ReadingLists.findByPk(req.params.id)

  const userCorrect = req.user.id === readingList.userId

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