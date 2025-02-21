const Tale = require('../database/models/Tale');
const TaleCharacter = require('../database/models/TaleCharacter');

const authenticateToken = require('../middleware/auth');

const S3Client = require('../helpers/aws/s3Client');
const Generator = require('../helpers/transformers/textGeneration');

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
    const generator = new Generator();

    const {characters, ...newTaleData} = req.body;

    try {
        const existingTale = await Tale.findOne({ where: { title: newTaleData.title } }); 
        if (existingTale) {
            return res.status(409).json({ msg: 'Tale already exists' });
        }

        const {key} = await s3Client.uploadFile(req.file, newTaleData.authorId, newTaleData.title);
        newTaleData.taleImage = key;

        const talePrompt = `
            Como escritor latinoamericano, genera un cuento literario con la siguiente estructura:
            Género: Cuento de terror
            Introducción: Un jardín abandonado en Buenos Aires...
            Desarrollo: Dos amigos encuentran una puerta secreta...
            Conclusión: La puerta los lleva a su propia infancia.
        `

        

        const newTale = await Tale.create(newTaleData);
        
        if (characters && characters.length > 0) {
            const taleCharacters = characters.map(characterId => ({
              taleId: newTale.id,
              characterId: parseInt(characterId),
            }));
      
            await TaleCharacter.bulkCreate(taleCharacters);
        }

        res.status(201).json({
            msg: 'Tale created successfully',
            newTale
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