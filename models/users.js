const {DataTypes} = require('sequelize');
const sequelize = require('../utils/DB');

const users = sequelize.define('Users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    year: {
        type: DataTypes.DATE,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type:DataTypes.STRING,
        allowNull:false
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    createdAt: false,
    updatedAt: false
});

module.exports = users;