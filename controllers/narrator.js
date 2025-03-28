const Narrator = require('../database/models/Narrator');
const Tale = require('../database/models/Tale');

const authenticateToken = require('../middleware/auth');

const generateNarration = require('../helpers/transformers/speechGeneration');

const getNarrators = async (req, res) => {    
    try {
        const narrators = await Narrator.findAll({
            where: { 
                authorId: req.user.id,
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
        const id = req.params.narratorId;
        const narrator = await Narrator.findByPk(id);
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
        newNarrator.authorId = req.user.id;
        const createdNarrator = await Narrator.create(newNarrator);
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
        const id = req.params.narratorId;

        const isInUse = await Tale.findOne({
            where: { narratorId: id }
        });

        if (isInUse) {
            return res.status(409).json({ msg: 'Narrator in use' });
        }

        const updatedRows = await Narrator.update(narratorInfo, {
            where: { id: id }
        });
        
        if (updatedRows) {
            const updatedNarrator = await Narrator.findByPk(id);
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

        const isInUse = await Tale.findOne({
            where: { narratorId: id }
        });

        if (isInUse) {
            return res.status(409).json({ msg: 'Narrator in use' });
        }
        
        const deletedRows = await Narrator.destroy({
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

const narrate = async (req, res) => {
    try {
        const narrationData = req.body;
        const id = narrationData.narratorId;
        const textSegment = narrationData.textSegment;
        
        const narrator = await Narrator.findByPk(id);

        if(narrator) {
            const speechAudio = await generateNarration(textSegment, narrator.voiceReference);
            res.setHeader('Content-Type', 'audio/mpeg');
            return res.send(speechAudio);
        }
        return res.status(404).json({msg: 'Narrator not found'});
    } catch (error) {
        return res.status(500).json({ msg: 'Internal Server Error', error: error.message });
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
    narrate: [authenticateToken, narrate],
    notFound
}