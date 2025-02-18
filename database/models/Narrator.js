const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TaleNarrator = require('./TaleNarrator');

class Narrator extends Model {}

Narrator.init({
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
    alias: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    voiceReference: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    sequelize,
    tableName: 'Narrators',
    modelName: 'narrator'
});	


Narrator.hasMany(TaleNarrator, {
    foreignKey: 'narratorId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

TaleNarrator.belongsTo(Narrator, {
    foreignKey: 'narratorId',
    targetKey: 'id'
});

module.exports = Narrator;