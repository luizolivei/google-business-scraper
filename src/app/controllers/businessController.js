const Business = require('../models/Business');

const saveBusinessInfo = async (businessInfo) => {
    try {
        const existingBusiness = await Business.findOne({
            where: {
                name: businessInfo.name,
                address: businessInfo.address,
                page: businessInfo.page  // Inclui a verificação de página
            }
        });

        if (existingBusiness) {
            console.log(`Empresa ${businessInfo.name} na página ${businessInfo.page} já existe no banco de dados.`);
            return existingBusiness;
        }

        const newBusiness = await Business.create({
            name: businessInfo.name,
            phone: businessInfo.phone,
            address: businessInfo.address,
            rating: businessInfo.rating,
            reviewCount: businessInfo.reviewCount,
            website: businessInfo.website,
            facebook: businessInfo.facebook,
            instagram: businessInfo.instagram,
            category: businessInfo.category,
            page: businessInfo.page,  // Salva a página
        });

        console.log(`Empresa ${businessInfo.name} foi salva com sucesso na página ${businessInfo.page}.`);
        return newBusiness;
    } catch (error) {
        console.error('Erro ao salvar as informações da empresa:', error);
    }
};

module.exports = {
    saveBusinessInfo,
};
