const {Router} = require('express');
const {
    getNarrators,
    getNarrator,
    createNarrator,
    updateNarrator,
    deleteNarrator,
    notFound
} = require('../controllers/narrator');

const router = Router();

router.get('/list', getNarrators);

router.get('/:narratorId', getNarrator);

router.post('/', createNarrator);

router.put('/:narratorId', updateNarrator);

router.delete('/:narratorId', deleteNarrator);

router.put('*', notFound);

module.exports = router;