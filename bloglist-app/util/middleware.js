const errorHandler = (error, req, res, next) => {
  res.status(400).send({ error: error.message })

  next(error)
}

module.exports = {
  errorHandler
}