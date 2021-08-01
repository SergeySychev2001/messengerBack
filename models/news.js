const { DataTypes } = require('sequelize');
const sequelize = require('../utils/DB');

const news = sequelize.define('News', {
    id:{
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    userId:{
        type: DataTypes.STRING,
        allowNull: false
    },
    body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tags: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    }
},{
    createdAt: false,
    updatedAt: false
});

module.exports = news;