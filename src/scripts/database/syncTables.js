const sequelize = require('../../config/database');

require('../../app/models/Search');
require('../../app/models/City');
require('../../app/models/SearchCity');
require('../../app/models/SearchEnterprise');
require('../../app/models/Business');

sequelize.sync({alter: true})
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch((error) => {
        console.error('Erro ao sincronizar o banco de dados:', error);
    });
