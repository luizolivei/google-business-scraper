const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');
const fs = require('fs');

const generateExcelFile = async (businesses, searchId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Empresas');

    // Definir as colunas
    worksheet.columns = [
        { header: 'Nome', key: 'name', width: 30 },
        { header: 'Telefone', key: 'phone', width: 20 },
        { header: 'Endereço', key: 'address', width: 30 },
        { header: 'Nota', key: 'rating', width: 8 },
        { header: 'Avaliações', key: 'reviewCount', width: 20 },
        { header: 'Website', key: 'website', width: 30 },
        { header: 'Facebook', key: 'facebook', width: 30 },
        { header: 'Instagram', key: 'instagram', width: 30 },
        { header: 'Categoria', key: 'category', width: 30 }
    ];

    // Adicionar as linhas com os dados das empresas
    businesses.forEach(business => {
        worksheet.addRow(business);
    });

    // Salvar o arquivo Excel na pasta temporária do sistema
    const tempDir = os.tmpdir(); // Pasta temporária do sistema operacional
    const filePath = path.join(tempDir, `search_${searchId}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    return filePath;
};

module.exports = {
    generateExcelFile
};
