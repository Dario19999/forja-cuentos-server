const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/config');

class Character extends Model {}

Character.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    taleId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    role: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

sequelize.sync();

module.exports = Character;
