const Narrator = require('../database/models/Narrator');

const getNarrator = (req, res) => {    
    res.json({
        msg: 'get API'
    });
}

const createNarrator = (req, res) => {    
    res.json({
        msg: 'post API'
    });
}   

const updateNarrator = (req, res) => {        
    const id = req.params.narratorId;
    res.json({
        msg: 'put API',
        id
    });
}

const deleteNarrator = (req, res) => {
    const id = req.params.narratorId;
    res.json({
        msg: 'delete API',
        id
    });
}   

const notFound = (req, res) => {
    const id = req.params.narratorId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getNarrator,
    createNarrator,
    updateNarrator,
    deleteNarrator,
    notFound
}