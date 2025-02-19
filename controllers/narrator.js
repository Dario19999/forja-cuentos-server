const Narrator = require('../database/models/Narrator');
const authenticateToken = require('../middleware/auth');

const getNarrators = async (req, res) => {    
    try {
        const narratorModel = Narrator;
        const narrators = await narratorModel.findAll({
            where: { 
                authorId: req.query.authorId,
            }
        }
        );
        res.json(narrators);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const getNarrator = async (req, res) => {    
    try {
        const narratorModel = Narrator;
        const id = req.params.narratorId;
        const narrator = await narratorModel.findByPk(id);
        if (!narrator) {
            return res.status(404).json({ msg: 'Narrator not found' });
        }
        res.json(narrator);
        console.log("ID", id);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const createNarrator = async (req, res) => {    
    try {
        const newNarrator = req.body;
        const narratorModel = Narrator;
        const createdNarrator = await narratorModel.create(newNarrator);
        res.status(201).json({
            msg: 'Narrator created successfully',
            createdNarrator
        });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}   

const updateNarrator = async (req, res) => {        
    try {
        const narratorInfo = req.body;
        const narratorModel = Narrator;
        const id = req.params.narratorId;
        const updatedRows = await narratorModel.update(narratorInfo, {
            where: { id: id }
        });
        
        if (updatedRows) {
            const updatedNarrator = await narratorModel.findByPk(id);
            return res.json({
                msg: 'Narrator updated successfully',
                updatedNarrator
            });
        }
        res.status(404).json({ msg: 'User not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const deleteNarrator = async (req, res) => {
    try {       
        const id = req.params.narratorId;
        
        const narratorModel = Narrator;
        const deletedRows = await narratorModel.destroy({
            where: { id: id },
            logging: console.log
        });

        if (deletedRows) {
            return res.json({
                msg: 'Narrator deleted successfully',
                id
            });
        }
        res.status(404).json({ msg: 'Narrator not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}   

const notFound = (req, res) => {
    const id = req.params.narratorId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getNarrators: [authenticateToken, getNarrators],
    getNarrator: [authenticateToken, getNarrator],
    createNarrator: [authenticateToken, createNarrator],
    updateNarrator: [authenticateToken, updateNarrator],
    deleteNarrator: [authenticateToken, deleteNarrator],
    notFound
}