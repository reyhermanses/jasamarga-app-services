const service = require('../resources/resetRedis')
const resetRedis = async (req, res, next) => {
  try {
    const run = await service()
    return res.status(200).send({ status: run })
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
}

module.exports = { resetRedis }