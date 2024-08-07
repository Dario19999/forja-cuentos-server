const express = require('express');
const cors = require('cors');

class Server {
    constructor() {
        this.express = express();
        this.port = process.env.PORT;
        //Middlewares
        this.middleware();
        //Routes
        this.routes();
        
    }

    middleware() {
        this.express.use(express.static('public'));
        this.express.use(cors());
        this.express.use(express.json());
    }

    routes() {
        this.express.get('/api', (req, res) => {
            res.send('Hello, World!');
        });
    }

    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;