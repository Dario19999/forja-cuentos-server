const express = require('express');
const cors = require('cors');
const { sequelize } = require('./config/database');
const cookieParser = require('cookie-parser');

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
        this.express.use(cors({
            origin: function (origin, callback) {
                const allowedOrigins = ['http://localhost:4200'];
                if (!origin || allowedOrigins.indexOf(origin) !== -1) {
                  callback(null, true);
                } else {
                  callback(new Error('No permitido por CORS'));
                }
              },
              credentials: true,
              optionsSuccessStatus: 200
        }));
        this.express.use(express.json());
        this.express.use(cookieParser());
    }

    routes() {
        this.express.use('/api/user', require('../routes/user'));
        this.express.use('/api/character', require('../routes/character'));
        this.express.use('/api/narrator', require('../routes/narrator'));
        this.express.use('/api/tale', require('../routes/tale'));
        this.express.use('/health', require('../routes/healthCheck'));

        // Guard routes
        this.express.use((req, res, next) => {
            const error = {
            status: 404,
            message: "Route not found",
            };
            next(error);
        });
        
        this.express.use((error, req, res, next) => {
            res.status(error.status || 500);
            console.log("ERROR", error);
            res.json({
            error: {
                message: error.message,
                status: error.status,
            },
            });
        });

    }

    listen() {
        this.express.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }

}

module.exports = Server;