const Tale = require('../database/models/Tale');
const TaleNarrator = require('../database/models/TaleNarrator');
const TaleCharacter = require('../database/models/TaleCharacter');

const getTale = (req, res) => {    
    res.json({
        msg: 'get API'
    });
}   

const createTale = (req, res) => {    
    res.json({
        msg: 'post API'
    });
}

const updateTale = (req, res) => {        
    const id = req.params.taleId;
    res.json({
        msg: 'put API',
        id
    });
}

const deleteTale = (req, res) => {
    const id = req.params.taleId;
    res.json({
        msg: 'delete API',
        id
    });
}

const notFound = (req, res) => {
    const id = req.params.taleId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getTale,
    createTale,
    updateTale,
    deleteTale,
    notFound
}