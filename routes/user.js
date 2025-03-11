const { Router } = require('express');
const {
    getUser,
    updateUser,
    createUser,
    deleteUser,
    login,
    logout,
    notFound
} = require('../controllers/user');

const router = Router();
 
router.get('/', getUser);

router.post('/login', login);

router.post('/logout', logout);

router.post('/', createUser);

router.put('/', updateUser);

router.delete('/', deleteUser);

router.put('*', notFound);

module.exports = router;