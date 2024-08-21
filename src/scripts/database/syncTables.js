const sequelize = require('../../config/database');
const log = require('electron-log');

require('../../app/models/Search');
require('../../app/models/City');
require('../../app/models/SearchCity');
require('../../app/models/SearchEnterprise');
require('../../app/models/Business');

sequelize.sync({ alter: true, force: false })
    .then(() => {
        log.info('Banco de dados sincronizado');
    })
    .catch((error) => {
        log.error('Erro ao sincronizar o banco de dados:', error);
    });
