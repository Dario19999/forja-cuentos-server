const Tale = require('../database/models/Tale');
const TaleCharacter = require('../database/models/TaleCharacter');
const TaleNarrator = require('../database/models/TaleNarrator');
const authenticateToken = require('../middleware/auth');
const S3Client = require('../helpers/aws/s3Client');

const getTales = async (req, res) => {    
    try {
        const tales = await Tale.findAll({
            where: { 
                authorId: req.query.authorId,
            }
        });
        res.json(tales);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}   

const getTale = async (req, res) => {    
    try {
        const id = req.params.taleId;
        const tale = await Tale.findByPk(id);
        if (!tale) {
            return res.status(404).json({ msg: 'Tale not found' });
        }
        res.json(tale);
        console.log("ID", id);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}   

const createTale = async (req, res) => {    
    const s3Client = new S3Client();

    const {narratorId, characters, ...newTaleData} = req.body;

    try {
        const existingTale = await Tale.findOne({ where: { title: newTaleData.title } }); 
        if (existingTale) {
            return res.status(409).json({ msg: 'Tale already exists' });
        }

        const {key} = await s3Client.uploadFile(req.file, newTaleData.authorId, newTaleData.title);
        newTaleData.taleImage = key;

        const newTale = await Tale.create(newTaleData);
        
        const newNarration = await TaleNarrator.create({
            taleId: newTale.id,
            narratorId
        })

        res.status(201).json({
            msg: 'Tale created successfully',
            newTale,
            newNarration
        });
    } 
    catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const updateTale = (req, res) => {        
    const id = req.params.taleId;
    res.json({
        msg: 'put API',
        id
    });
}

const deleteTale = async (req, res) => {
    try {
        const id = req.params.taleId;

        const deletedRows = await Tale.destroy({
            where: { id: id },
            logging: console.log
        });

        if (deletedRows) {
            return res.json({ 
                msg: 'Tale deleted successfully',
                id
            });
        }
        res.status(404).json({ msg: 'Tale not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}

const notFound = (req, res) => {
    const id = req.params.taleId;
    res.status(404).json({
        msg: '404 - Not Found',
        id
    });
}

module.exports = {
    getTales: [authenticateToken, getTales],
    getTale: [authenticateToken, getTale],
    createTale: [authenticateToken, createTale],
    updateTale: [authenticateToken, updateTale],
    deleteTale: [authenticateToken, deleteTale],
    notFound
}