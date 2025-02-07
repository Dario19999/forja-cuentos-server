const {Router} = require('express');
const {
    getNarrator,
    createNarrator,
    updateNarrator,
    deleteNarrator,
    notFound
} = require('../controllers/narrator');

const router = Router();

router.get('/', getNarrator);

router.post('/', createNarrator);

router.put('*', notFound);

router.delete('/', deleteNarrator);

router.put('/:narratorId', updateNarrator);

module.exports = router;