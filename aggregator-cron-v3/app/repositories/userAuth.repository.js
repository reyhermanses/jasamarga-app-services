const { UserAuth } = require("../../models");

const modernizeDefaultPassword = async () => {
  return await UserAuth.update({ default_password: false }, { where: {} });
};

module.exports = {
  modernizeDefaultPassword,
};
