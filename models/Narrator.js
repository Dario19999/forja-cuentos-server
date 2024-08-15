const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../database/config');

const Tale = require('./Tale');

class Narrator extends Model {}

Narrator.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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

Narrator.hasMany(Tale, { 
    foreignKey: 'narratorId',
    sourceKey: 'id',
    onDelete: 'SET NULL'
});

Tale.belongsTo(Narrator, {
    foreignKey: 'narratorId',
    targetKey: 'id'
})

sequelize.sync();

module.exports = Narrator;