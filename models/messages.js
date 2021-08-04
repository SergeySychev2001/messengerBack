const { DataTypes } = require('sequelize');
const sequelize = require('../utils/DB');

const messages = sequelize.define('Messages', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    firstUserId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secondUserId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    createdAt: false,
    updatedAt: false
});

module.exports = messages;