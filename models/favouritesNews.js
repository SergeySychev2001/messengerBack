const { DataTypes} = require('sequelize');
const sequelize = require('../utils/DB');

const favouritesNews = sequelize.define('FavouritesNews', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    newsId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
},{
    createdAt: false,
    updatedAt: false
});

module.exports = favouritesNews;