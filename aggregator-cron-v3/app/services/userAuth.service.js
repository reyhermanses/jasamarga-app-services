const repository = require("../repositories/userAuth.repository");

const resetDefaultPassword = async () => {
  return await repository.modernizeDefaultPassword();
};

module.exports = {
  resetDefaultPassword,
};
