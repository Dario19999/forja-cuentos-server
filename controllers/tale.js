const Tale = require('../database/models/Tale');
const Character = require('../database/models/Character');
const Narrator = require('../database/models/Narrator');

const authenticateToken = require('../middleware/auth');

const S3Client = require('../helpers/aws/s3Client');
const TaleGenerator = require('../helpers/transformers/textGeneration');

const getTales = async (req, res) => {    
    try {
        const tales = await Tale.findAll({
            where: { 
                authorId: req.user.id,
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
    const taleGenerator = new TaleGenerator();

    const newTaleData = req.body;

    try { 
        const existingTale = await Tale.findOne({ 
            where: { 
                title: newTaleData.title,
                authorId: req.user.id
            } 
        }); 
        if (existingTale) {
            return res.status(409).json({ msg: 'Tale already exists' });
        }

        const {key} = await s3Client.uploadFile(req.file, req.user.id, newTaleData.title);
        newTaleData.taleImage = key;

        const narratorData = await Narrator.findOne({
            where: { 
                id: newTaleData.narratorId,
            }
        });
        newTaleData.narrator = {
            name: narratorData.alias,
            style: narratorData.type,
            voice: narratorData.voiceReference
        };
        
        let characterList = await Character.findAll({
            where: { 
                id: newTaleData.characters,
            }
        })
        
        characterList = characterList.map(character => {
            return {
                name: character.name,
                type: character.type,
                role: character.role
            }
        });

        newTaleData.characters = characterList;

        // await taleGenerator.genTale(newTaleData);

        console.log(taleGenerator.getFullTale);

        const newTale = await Tale.create(newTaleData);
        
        if (characters && characters.length > 0) {
            const taleCharacters = characters.map(characterId => ({
              taleId: newTale.id,
              characterId: parseInt(characterId),
            }));
      
            await TaleCharacter.bulkCreate(taleCharacters);
        }

        res.status(201).json({
            msg: 'Tale created successfully'
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

        const tale = await Tale.findByPk(id);
        if (!tale) {
            return res.status(404).json({ msg: 'Tale not found' });
        }

        let s3Key = tale.taleImage;
        if (s3Key) {
            const s3Client = new S3Client();
            await s3Client.deleteFile(s3Key);
        }

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