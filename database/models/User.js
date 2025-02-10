const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

const Tale = require('./Tale');

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
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(20),
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

module.exports = User;