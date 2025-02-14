require('dotenv').config();

const Server = require('./database/server');

const server = new Server();
 
server.listen();