const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const Character = require('./Character');

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
    narratorId: {
        type: DataTypes.INTEGER,
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
    creationDate: {
        type: DataTypes.DATE,
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
    }
}, {
    sequelize,
    tableName: 'Tales',
    modelName: 'tale'
});

Character.hasMany(Tale, {
    foreignKey: 'taleId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Tale.belongsTo(Character, {
    foreignKey: 'taleId',
    targetKey: 'id'
});

module.exports = Tale;