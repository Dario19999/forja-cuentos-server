const {Router} = require('express');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

const {
    getTales,
    getTale,
    createTale,
    updateTale,
    deleteTale,
    notFound
} = require('../controllers/tale');

const router = Router();

router.get('/list', getTales);

router.get('/:taleId', getTale);

router.post('/', upload.single('taleImage'), createTale);

router.put('/:taleId', updateTale);

router.delete('/:taleId', deleteTale);

router.put('*', notFound);

module.exports = router;