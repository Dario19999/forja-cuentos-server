const User = require('../database/models/User');

const getUser = (req, res) => {    
    res.json({
        msg: 'get API'
    });
}

const createUser = (req, res) => {    
    res.json({
        msg: 'post API'
    });
}

const updateUser = (req, res) => {        
    const id = req.params.userId;
    res.json({
        msg: 'put API',
        id
    });
}

const deleteUser = (req, res) => {
    const id = req.params.userId;
    res.json({
        msg: 'delete API',
        id
    });
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
    createUser,
    updateUser,
    deleteUser,
    notFound
}