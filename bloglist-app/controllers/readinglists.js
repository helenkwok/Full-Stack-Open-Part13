const { ReadingLists } = require('../models')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const readingLists = await ReadingLists.findAll({
    attributes: { }
  })
  res.json(readingLists)
})

router.post('/', async (req, res) => {
  const { blogId, userId } = req.body

  const reading = await ReadingLists.create({
    blogId,
    userId
  })
    res.json(reading)
})

module.exports = router