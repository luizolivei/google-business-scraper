const Business = require('../models/Business');

const saveBusiness = async (businessInfo) => {
    const existingBusiness = await Business.findOne({
        where: {
            name: businessInfo.name,
            address: businessInfo.address
        }
    });

    if (existingBusiness) {
        console.log(`Empresa ${businessInfo.name} já existe no banco de dados.`);
        return existingBusiness;
    }

    return await Business.create(businessInfo);
};

module.exports = {
    saveBusiness,
};
