const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.status(200).send('Server is running');
});

module.exports = router;