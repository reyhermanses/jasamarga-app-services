const axios = require('axios')

const resetRedis = async () => {
  const config = {
    headers: {
      'X-API-KEY': process.env.API_KEY
    },
  };
  const response = await axios.get(`${process.env.API_URL}/api/v1/reset-redis`, config);
  return response
}

module.exports = resetRedis