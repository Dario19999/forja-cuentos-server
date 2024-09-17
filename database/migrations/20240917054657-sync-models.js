'use strict';
const { sequelize } = require('../../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        await sequelize.sync({ alter: true });
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
        await queryInterface.dropTable('Characters');
        await queryInterface.dropTable('Narrators');
        await queryInterface.dropTable('Tales');
    }
};
