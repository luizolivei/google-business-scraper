const Business = require('../models/Business');
const sequelize = require('../../config/database');

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
        const query = `
            SELECT 
                b.id, 
                b.name, 
                b.phone, 
                b.address, 
                b.rating, 
                b."reviewCount", 
                b.website, 
                b.facebook, 
                b.instagram, 
                b.category, 
                b.page 
            FROM 
                businesses b
            JOIN 
                search_enterprises se ON se.id_enterprise = b.id
            WHERE 
                se.id_search = :searchId
        `;

        const businesses = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { searchId }
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
