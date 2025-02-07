const {Router} = require('express');

const {
    getTale,
    createTale,
    updateTale,
    deleteTale,
    notFound
} = require('../controllers/tale');

const router = Router();

router.get('/', getTale);

router.post('/', createTale);

router.put('/:taleId', updateTale);

router.delete('/', deleteTale);

router.put('*', notFound);

module.exports = router;