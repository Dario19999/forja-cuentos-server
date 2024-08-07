const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
    res.json({
        msg: 'get API'
    });
});

router.put('/', (req, res) => {        
    const id = req.params.id;
    res.json({
        msg: 'put API',
        id
    });
});

router.post('/', (req, res) => {    
    res.json({
        msg: 'post API'
    });
});

router.delete('/', (req, res) => {
    res.json({
        msg: 'delete API'
    });
});

module.exports = router;