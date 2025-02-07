const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class TaleNarrator extends Model {}

TaleNarrator.init({
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
    narratorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'TaleNarrators',
    modelName: 'taleNarrator'
});

module.exports = TaleNarrator;