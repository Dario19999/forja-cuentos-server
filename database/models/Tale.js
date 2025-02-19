const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const TaleCharacter = require('./TaleCharacter');
const TaleNarrator  = require('./TaleNarrator');

class Tale extends Model {}

Tale.init({
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
    taleImage: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    introduction: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    development: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    conclusion: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fullTale: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    synopsis: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Tales',
    modelName: 'tale'
});

Tale.hasMany(TaleCharacter, {
    foreignKey: 'taleId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

TaleCharacter.belongsTo(Tale, {
    foreignKey: 'taleId',
    targetKey: 'id'
});

Tale.hasMany(TaleNarrator, {
    foreignKey: 'taleId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

TaleNarrator.belongsTo(Tale, {
    foreignKey: 'taleId',
    targetKey: 'id'
});

module.exports = Tale;