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


let io = socketIO(server);


// io.on('connection', (client) => {
//     console.log('Usuario conectado');
//     client.emit('enviarMensaje', { usuario: 'Admin', mensaje: 'Bienvenido a esta App' });
//     client.on('disconnect', () => {
//         console.log('Usuario desconectado');
//     });

//     client.on('enviarMensaje', (mensaje, cb) =>{
//         console.log(mensaje);
//     });

//     client.on('imhere',(msj, cb) =>{
//         console.log(msj);
//         // timer
//         if(msj.message == 'Im here'){
//             console.log('in range')
//         }
//     });
// });

export default io;
require('./sockets/socket');



server.listen(port, () => {
    console.log(`Listening on ${port}`);
});