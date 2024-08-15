const Business = require('../models/Business');
const SearchEnterprise = require('../models/SearchEnterprise');

const saveBusinessInfo = async (businessInfo) => {
    try {
        const existingBusiness = await Business.findOne({
            where: {
                name: businessInfo.name,
                address: businessInfo.address,
            }
        });

        if (existingBusiness) {
            console.log(`Empresa ${businessInfo.name} na página ${businessInfo.page} já existe no banco de dados.`);
            return existingBusiness.id;
        }

        const newBusiness = await Business.create(businessInfo);

        console.log(`Empresa ${businessInfo.name} foi salva com sucesso na página ${businessInfo.page}.`);
        return newBusiness.id;
    } catch (error) {
        console.error('Erro ao salvar as informações da empresa:', error);
        throw error;
    }
};

const getBusinessesBySearch = async (searchId) => {
    try {
        const businesses = await Business.findAll({
            include: [{
                model: SearchEnterprise,
                where: { id_search: searchId },
                attributes: []
            }]
        });

        return businesses;
    } catch (error) {
        console.error('Erro ao buscar empresas pela pesquisa:', error);
        throw error;
    }
};

module.exports = {
    saveBusinessInfo,
    getBusinessesBySearch,
};
