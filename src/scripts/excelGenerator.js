const ExcelJS = require('exceljs');
const path = require('path');
const os = require('os');

const generateExcelFile = async (businesses, searchId) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Empresas');

    // Definir as colunas
    worksheet.columns = [
        { header: 'Nome', key: 'name', width: 30 },
        { header: 'Telefone', key: 'phone', width: 20 },
        { header: 'Endereço', key: 'address', width: 30 },
        { header: 'Nota', key: 'rating', width: 8 },
        { header: 'Avaliações', key: 'reviewCount', width: 8 },
        { header: 'Website', key: 'website', width: 30 },
        { header: 'Facebook', key: 'facebook', width: 30 },
        { header: 'Instagram', key: 'instagram', width: 30 },
        { header: 'Categoria', key: 'category', width: 30 },
        { header: 'Página', key: 'page', width: 10 },
        { header: 'Ordem', key: 'order', width: 10 },
        { header: 'Código IBGE', key: 'codigo_ibge', width: 15 },
        { header: 'Cidade', key: 'city_name', width: 20 },
        { header: 'Compromissos', key: 'compromissos', width: 40 },
        { header: 'Descrição', key: 'description', width: 40 },
        { header: 'Horário', key: 'schedule', width: 40 },
        { header: 'Título ID', key: 'id_title', width: 20 },
    ];

    // Aplicar negrito nas headers
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });

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
