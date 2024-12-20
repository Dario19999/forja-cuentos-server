const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class TaleCharacter extends Model {}

TaleCharacter.init({
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
    characterId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'TaleCharacters',
    modelName: 'taleCharacter'
});

module.exports = TaleCharacter;