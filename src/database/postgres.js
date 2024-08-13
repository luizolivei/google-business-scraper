const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'guiafacil',
    password: 'root',
    port: 5432,
});

client.connect()
    .then(() => console.log('Conectado ao banco de dados PostgreSQL'))
    .catch(err => console.error('Erro ao conectar ao banco de dados', err.stack));

module.exports = client;