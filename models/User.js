const UserModel = require('../database/models/User');

class User {
    constructor() {
        this.model = UserModel;
    }

    async getAll() {
        return await this.model.findAll();
    }

    async getById(id) {
        return await this.model.findByPk(id);
    }

    async create(data) {
        return await this.model.create(data);
    }

    async update(id, data) {
        return await this.model.update(data, {
            where: {
                id
            }
        });
    }

    async delete(id) {
        return await this.model.destroy({
            where: {
                id
            }
        });
    }
}