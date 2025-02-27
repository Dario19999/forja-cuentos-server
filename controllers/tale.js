const Tale = require('../database/models/Tale');
const Character = require('../database/models/Character');
const Narrator = require('../database/models/Narrator');
const TaleCharacter = require('../database/models/TaleCharacter');

const authenticateToken = require('../middleware/auth');

const S3Client = require('../helpers/aws/s3Client');
const s3Client = new S3Client();

const TaleGenerator = require('../helpers/transformers/textGeneration');

const getTales = async (req, res) => {    
    try {
        const tales = await Tale.findAll({
            where: { 
                authorId: req.user.id,
            }
        });

        const taleList = tales.map(tale => ({
            ...tale.toJSON(),
            imageUrl: s3Client.getPreSignedUrl(tale.taleImage)
        }));

        res.json(taleList);
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

        const taleWithImage = {
            ...tale.toJSON(),
            imageUrl: s3Client.getPreSignedUrl(tale.taleImage)
        }

        res.json(taleWithImage);
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }
}   

const createTale = async (req, res) => {
    const taleGenerator = new TaleGenerator();

    const newTaleData = req.body;
    newTaleData.authorId = req.user.id;
    
    let genTaleData = newTaleData;

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
        genTaleData.narrator = {
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

        genTaleData.parsedCharacters = characterList;

        await taleGenerator.genTale(genTaleData);
        newTaleData.fullTale = taleGenerator.getFullTale;

        await taleGenerator.genSynopsis();
        newTaleData.synopsis = taleGenerator.getSypnosis;

        const newTale = await Tale.create(newTaleData);
        
        if (newTale && newTaleData.characters && newTaleData.characters.length > 0) {
            const taleCharacters = newTaleData.characters.map(characterId => ({
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

const updateTale = async (req, res) => {   
    const taleUpdateInfo = req.body;     
    const id = req.params.taleId;

    try { 

        let s3Key = taleUpdateInfo.taleImage;
        if (s3Key) {
            const s3Client = new S3Client(); 
            await s3Client.deleteFile(s3Key);
        }

        const {key} = await s3Client.uploadFile(req.file, req.user.id, taleUpdateInfo.taleTitle);
        taleUpdateInfo.taleImage = key;

        const updatedRows = await Tale.update(
            { 
                title: taleUpdateInfo.taleTitle,
                taleImage: taleUpdateInfo.taleImage,
                fullTale: taleUpdateInfo.taleBody,
                synopsis: taleUpdateInfo.taleSynopsis
            },
            {
                where: { id: id }
            }
        );
    
        if(updatedRows) {
            const updatedTale = await Tale.findByPk(id);
            return res.json({
                msg: 'Tale updated successfully',
                updatedTale
            });
        }
    
        res.status(404).json({ msg: 'Tale not found' });
    } catch (error) {
        res.status(500).json({ msg: 'Internal Server Error', error: error.message });
    }

   
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