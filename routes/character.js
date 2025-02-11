const {Router} = require('express');

const {
    getCharacters,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    notFound
} = require('../controllers/character');    

const router = Router();

router.get('/list', getCharacters);

router.get('/:characterId', getCharacter);

router.post('/', createCharacter);

router.put('/:characterId', updateCharacter);

router.delete('/:characterId', deleteCharacter);

router.put('*', notFound);

module.exports = router;
