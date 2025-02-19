const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const Tale = require('./Tale');
const Narrator = require('./Narrator');
const Character = require('./Character');

class User extends Model {}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    secondLastName: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(80),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'Users',
    modelName: 'user'
});

User.hasMany(Tale, {
    foreignKey: 'authorId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Tale.belongsTo(User, {
    foreignKey: 'authorId',
    targetKey: 'id'
});

User.hasMany(Narrator, {
    foreignKey: 'authorId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Narrator.belongsTo(User, {
    foreignKey: 'authorId',
    targetKey: 'id'
});

User.hasMany(Character, {
    foreignKey: 'authorId',
    sourceKey: 'id',
    onDelete: 'CASCADE'
});

Character.belongsTo(User, {
    foreignKey: 'authorId',
    targetKey: 'id'
});

User.sync();

module.exports = User;