const express = require('express');
const cors = require('cors');
const { sequelize } = require('../database/config');
class Server {
    constructor() {
        this.express = express();
        this.port = process.env.PORT;

        //Connect to database
        this.connectDB();
        //Middlewares
        this.middleware();
        //Routes
        this.routes();
        
    }

    async connectDB() {
        await sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
    }

    middleware() {
        this.express.use(express.static('public'));
        this.express.use(cors());
        this.express.use(express.json());
    }

    routes() {
        this.express.use('/api/user', require('../routes/user'));
    }

    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;