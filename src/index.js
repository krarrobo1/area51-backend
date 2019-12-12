require("@babel/polyfill");

import app from './app';
import { port } from './config/config';

import http from 'http';
import socketIO from 'socket.io';






let server = http.createServer(app);

/*async function main() {
    await app.listen(port);
    console.log(`Server on port ${port}`);
}

main();*/


let io = socketIO(server, { pingTimeout: 60000, pingInterval: 25000 });
export default io;
require('./sockets/socket');

io.listen(7000);



server.listen(port, () => {
    console.log(`Listening on ${port}`);
});