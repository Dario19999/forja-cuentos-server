const User = require('../database/models/User');

const getUsers = async (req, res) => {    
    try {
        const userModel = User;
        const users = await userModel.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const getUser = async (req, res) => {    
    try {
        const userModel = User;
        const id = req.params.userId;
        const user = await userModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
        console.log("ID", id);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const createUser = async (req, res) => {
    try {
        const newUser = req.body;
        const userModel = User;
        const createdUser = await userModel.create(newUser);
        res.status(201).json({
            msg: 'User created successfully',
            createdUser
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const updateUser = async (req, res) => {

    try {
        const userInfo = req.body;
        const userModel = User;
        const id = req.params.userId;
        const updatedRows = await userModel.update(userInfo, {
            where: { id: id }
        });
        
        if (updatedRows) {
            const updatedUser = await userModel.findByPk(id);
            return res.json({
                msg: 'User updated successfully',
                updatedUser
            });
        }
        res.status(404).json({ msg: 'User not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {       
        const id = req.params.userId;
        
        const userModel = User;
        const deletedRows = await userModel.destroy({
            where: { id: id },
            logging: console.log
        });

        if (deletedRows) {
            return res.json({
                msg: 'User deleted successfully',
                id
            });
        }
        res.status(404).json({ msg: 'User not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const notFound = (req, res) => {
    const id = req.params.userId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getUser,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
    notFound
}