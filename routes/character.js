const {Router} = require('express');

const {
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    notFound
} = require('../controllers/character');    

const router = Router();

router.get('/', getCharacter);

router.post('/', createCharacter);

router.put('/:characterId', updateCharacter);

router.delete('/', deleteCharacter);

router.put('*', notFound);

module.exports = router;
