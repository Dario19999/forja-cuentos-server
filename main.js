require('dotenv').config();

const Server = require('./database/Server');

const server = new Server();

server.listen();