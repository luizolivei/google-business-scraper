const SearchEnterprise = require('../models/SearchEnterprise');
const log = require('electron-log');

const createSearchEnterpriseEntries = async (searchId, businessIds) => {
    try {
        for (const businessId of businessIds) {
            const existingEntry = await SearchEnterprise.findOne({
                where: {
                    id_search: searchId,
                    id_enterprise: businessId
                }
            });

            if (!existingEntry) {
                await SearchEnterprise.create({
                    id_search: searchId,
                    id_enterprise: businessId
                });
                log.info(`Associação entre search ID ${searchId} e business ID ${businessId} foi criada com sucesso.`);
            } else {
                log.info(`Associação entre search ID ${searchId} e business ID ${businessId} já existe. Pulando...`);
            }
        }
    } catch (error) {
        log.error('Erro ao criar associações em search_enterprises:', error);
        throw error;
    }
};

module.exports = {
    createSearchEnterpriseEntries,
};
