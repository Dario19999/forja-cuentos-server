const { Router } = require('express');
const {
    getUser,
    updateUser,
    createUser,
    deleteUser,
    notFound
} = require('../controllers/User');

const router = Router();

router.get('/', getUser);

router.post('/', createUser);

router.put('*', notFound);
router.put('/:userId', updateUser);

router.delete('/', deleteUser);


module.exports = router;