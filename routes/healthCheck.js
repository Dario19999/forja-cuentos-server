const {Router} = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({
        code: 200,
        status: 'UP'
    });
});

module.exports = router;