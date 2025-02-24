const Character = require('../database/models/Character');
const TaleCharacter = require('../database/models/TaleCharacter');

const authenticateToken = require('../middleware/auth');

const getCharacters = async (req, res) => {
    try {
        const characterModel = Character;
        const characters = await characterModel.findAll({
            where: { 
                authorId: req.user.id,
            }
        });
        res.json(characters);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const getCharacter = async (req, res) => {    
    try {
        const characterModel = Character;
        const id = req.params.characterId;
        const character = await characterModel.findByPk(id);
        if (!character) {
            return res.status(404).json({ msg: 'Character not found' });
        }
        res.json(character);
        console.log("ID", id);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const createCharacter = async (req, res) => {    
    try {
        const newCharacter = req.body;
        const characterModel = Character;
        const createdCharacter = await characterModel.create(newCharacter);
        res.status(201).json({
            msg: 'Character created successfully',
            createdCharacter
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const updateCharacter = async (req, res) => {        
    try {
        const characterInfo = req.body;
        const characterModel = Character;
        const id = req.params.characterId;
        const updatedRows = await characterModel.update(characterInfo, {
            where: { id: id }
        });
        
        if (updatedRows) {
            const updatedCharacter = await characterModel.findByPk(id);
            return res.json({
                msg: 'Character updated successfully',
                updatedCharacter
            });
        }
        res.status(404).json({ msg: 'Character not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const deleteCharacter = async (req, res) => {
    try {       
        const id = req.params.characterId;
        
        const characterModel = Character;
        const deletedRows = await characterModel.destroy({
            where: { id: id },
            logging: console.log
        });

        if (deletedRows) {
            return res.json({
                msg: 'Character deleted successfully',
                id
            });
        }
        res.status(404).json({ msg: 'Character not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const notFound = (req, res) => {
    const id = req.params.characterId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getCharacters: [authenticateToken, getCharacters],
    getCharacter: [authenticateToken, getCharacter],
    createCharacter: [authenticateToken, createCharacter],
    updateCharacter: [authenticateToken, updateCharacter],
    deleteCharacter: [authenticateToken, deleteCharacter],
    notFound
}