const SearchEnterprise = require('../models/SearchEnterprise');

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
                console.log(`Associação entre search ID ${searchId} e business ID ${businessId} foi criada com sucesso.`);
            } else {
                console.log(`Associação entre search ID ${searchId} e business ID ${businessId} já existe. Pulando...`);
            }
        }
    } catch (error) {
        console.error('Erro ao criar associações em search_enterprises:', error);
        throw error;
    }
};

module.exports = {
    createSearchEnterpriseEntries,
};
