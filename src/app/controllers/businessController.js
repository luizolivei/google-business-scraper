const Business = require('../models/Business');
const sequelize = require('../../config/database');
const log = require('electron-log');

const saveBusinessInfo = async (businessInfo) => {
    try {
        const existingBusiness = await Business.findOne({
            where: {
                name: businessInfo.name,
                address: businessInfo.address,
            }
        });

        if (existingBusiness) {
            log.info(`Empresa ${businessInfo.name} na página ${businessInfo.page} já existe no banco de dados.`);
            return existingBusiness.id;
        }

        const newBusiness = await Business.create(businessInfo);

        log.info(`Empresa ${businessInfo.name} foi salva com sucesso na página ${businessInfo.page}.`);
        return newBusiness.id;
    } catch (error) {
        log.error('Erro ao salvar as informações da empresa:', error);
        throw error;
    }
};

const getBusinessesBySearch = async (searchId) => {
    return await Business.getBusinessesBySearch(searchId);
};

module.exports = {
    saveBusinessInfo,
    getBusinessesBySearch,
};
