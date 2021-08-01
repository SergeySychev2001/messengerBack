const {DataTypes} = require('sequelize');
const sequelize = require('../utils/DB');

const subscribtions = sequelize.define('Subscribtions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    firstUserId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    secondUserId: {
        type: DataTypes.STRING,
        allowNull: false
    }
},{
    createdAt: false,
    updatedAt: false
});

module.exports = subscribtions;