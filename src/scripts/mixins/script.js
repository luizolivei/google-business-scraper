const path = require("path");
const {app} = require("electron");

const getConfigPath = () => {
    return path.join(app.getPath('userData'), 'dbConfig.json');
};

const removeAccents = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

module.exports = {
    removeAccents,
    getConfigPath
};