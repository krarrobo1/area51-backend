require("@babel/polyfill");
import app from './app';
import { port } from './config/config';

import http from 'http';
//import socketIO from 'socket.io';


/*async function main() {
    await app.listen(port);
    console.log(`Server on port ${port}`);
}

main();*/

/*
let io = socketIO(server);
io.on('connection', (client) => {
    client.on('range', () => {

    });
});*/

let server = http.createServer(app);

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});