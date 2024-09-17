const {sequelize } = require('../config/database');
const User = require('./User');
const Character = require('./Character');
const Narrator = require('./Narrator');
const Tale = require('./Tale');

// List models to import
User.sync();
Character.sync();
Narrator.sync();
Tale.sync();

module.exports = {
    sequelize,
    User,
    Character,
    Narrator,
    Tale
}