const RedisClient = require("redis").createClient;

require('dotenv').config()

const RedisCon = RedisClient({
  url: `redis://default:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:6379`
});

RedisCon.on("error", function (err) {
  console.log("Error " + err);
});

/**
 * get redis cache
 * @param {string} redis_key
 */
function get(redis_key) {
  return new Promise((resolve, reject) => {
    RedisCon.get(redis_key, (err, reply) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        console.log("Success Redis Get", redis_key);
        resolve({ reply });
      }
    });
  });
}

/**
 * set redis cache
 * @param {string} redis_key
 * @param {string} redis_value
 */
function set(redis_key, redis_value) {
  console.log("Success Redis Set", redis_key)
  RedisCon.set(redis_key, redis_value, 'EX', 60 * 60 * 24);
}

function del(redis_key) {
  RedisCon.del(redis_key)
}

module.exports.get = get;
module.exports.set = set;
module.exports.del = del;
