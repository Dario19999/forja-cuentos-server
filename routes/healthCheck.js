const {Router} = require('express');
const router = Router();

router.get('/health', (req, res) => {
    res.statusCode(200).json({
        status: 'UP'
    });
});