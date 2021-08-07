const Sequelize = require('sequelize');

const DB_NAME = 'messenger';
const USER_NAME = 'root';
const USER_PASSWORD = 'root';

const sequelize = new Sequelize(DB_NAME, USER_NAME, USER_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 6000,
    logging: false
});

module.exports = sequelize;