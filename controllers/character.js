const Character = require('../database/models/Character');

const getCharacter = (req, res) => {    
    res.json({
        msg: 'get API'
    });
}

const createCharacter = (req, res) => {    
    res.json({
        msg: 'post API'
    });
}

const updateCharacter = (req, res) => {        
    const id = req.params.characterId;
    res.json({
        msg: 'put API',
        id
    });
}

const deleteCharacter = (req, res) => {
    const id = req.params.characterId;
    res.json({
        msg: 'delete API',
        id
    });
}

const notFound = (req, res) => {
    const id = req.params.characterId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    notFound
}