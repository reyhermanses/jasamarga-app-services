const Redis = require("../../config/redis");

const reset = async () => {
  try {
    Redis.del("employee");
    Redis.del("employee:tiny");
    Redis.del("employee-alternate");
    Redis.del("org-formation");
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

module.exports = reset