const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TaleCharacter = require('./TaleCharacter');

class Character extends Model {}

Character.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    authorId: {
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
}, {
    sequelize,
    tableName: 'Characters',
    modelName: 'character'
});


Character.hasMany(TaleCharacter, {
    foreignKey: 'characterId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

TaleCharacter.belongsTo(Character, {
    foreignKey: 'characterId',
    targetKey: 'id'
});

module.exports = Character;
