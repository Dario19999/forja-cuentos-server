const { Router } = require('express');
const {
    getUser,
    getUsers,
    updateUser,
    createUser,
    deleteUser,
    login,
    logout,
    notFound
} = require('../controllers/user');

const router = Router();

router.get('/list', getUsers);
 
router.get('/:userId', getUser);

router.post('/login', login);

router.post('/logout', logout);

router.post('/', createUser);

router.put('/:userId', updateUser);

router.delete('/:userId', deleteUser);

router.put('*', notFound);

module.exports = router;