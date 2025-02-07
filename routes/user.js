const { Router } = require('express');
const {
    getUser,
    updateUser,
    createUser,
    deleteUser,
    notFound
} = require('../controllers/user');

const router = Router();

router.get('/', getUser);

router.post('/', createUser);

router.put('/:userId', updateUser);

router.delete('/', deleteUser);

router.put('*', notFound);

module.exports = router;