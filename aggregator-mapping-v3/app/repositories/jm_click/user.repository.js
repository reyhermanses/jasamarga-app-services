const { User } = require('../../../models_jmclick')
const { Op } = require("sequelize");

async function acquireAllData() {
    return await User.findAll(
        {
            where: {
                [Op.or]: [
                    {
                        IS_LDAP: null
                    },
                    {
                        IS_LDAP: 0
                    }
                ]
            },
            raw: true
        },
    )
}

module.exports = {
    acquireAllData
}