const User = require('../database/models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/auth');

require('dotenv').config();

const getUser = async (req, res) => {    
    try {
        const userModel = User;
        const id = req.user.id;
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
 
        const existingUser = await userModel.findOne({ where: { email: newUser.email } });
        if (existingUser) {
            return res.status(409).json({ msg: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(newUser.password, 10);
        newUser.password = hashedPassword;

        const createdUser = await userModel.create(newUser);

        // Omit password and timestamps from the response
        const { 
            password,
            createdAt, 
            updatedAt, 
            ...publicUser
        } = createdUser.dataValues;

        res.status(201).json({
            msg: 'User created successfully',
            createdUser: publicUser
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const updateUser = async (req, res) => {

    try {
        const userInfo = req.body;
        const userModel = User;
        const id = req.user.id;
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
        const id = req.user.id;
        
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

const logout = (req, res) => {
    res.clearCookie('access_token').json({ msg: 'Logged out successfully' });
}

const login = async (req, res) => {
    try {
        const userModel = User;
        const { email, password } = req.body;
        const user = await userModel.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.dataValues.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }

        const token = await jwt.sign({ id: user.dataValues.id, email: user.dataValues.email }, process.env.SECRET_JWT, { expiresIn: '1h' });

        // Omit password and timestamps from the response
        const { 
            password: _,
            createdAt, 
            updatedAt, 
            ...publicUser
        } = user.dataValues;

        res
        .cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            domain: process.env.NODE_ENV === 'production' ? 'http://localhost:3000' : 'https://api.forja-cuentos.com',
            maxAge: 1000 * 60 * 60, // 1 hour
            path: '/'
        })
        .json({ publicUser, token });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const notFound = (req, res) => {
    const id = req.user.id;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getUser: [authenticateToken, getUser],
    createUser,
    updateUser: [authenticateToken, updateUser],
    deleteUser: [authenticateToken, deleteUser],
    login,
    logout,
    notFound
}
