require("@babel/polyfill");

import app from './app';
import { port } from './config/config';

import http from 'http';
import {marcarSalidas} from './services/task';
import cron from 'node-cron';

import socketIO from 'socket.io';

let server = http.createServer(app);

cron.schedule('*/1 * * * *', marcarSalidas).start();

let io = socketIO(server, {pingTimeout: 60000});

// Redis config
// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

export default io;
require('./sockets/socket');



server.listen(port, () => {
    console.log(`Listening on ${port}`);
});