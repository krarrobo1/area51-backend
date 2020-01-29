require("@babel/polyfill");

import app from './app';
import { port, time } from './config/config';


import { marcarSalidas } from './services/task';
// import { stillActive } from './services/pingTask';
import cron from 'node-cron';

/*import socketIO from 'socket.io';*/



// let server = http.Server(app);

// Revisa cada 20 minutos si siguen activos
//cron.schedule('*/20 * * * *', stillActive).start();
// Marca la salida a la hora de finalizacion de jornada
cron.schedule(time, marcarSalidas).start();

/*let io = socketIO(server, { pingTimeout: 60000 });*/





// Redis config
// const redisAdapter = require('socket.io-redis');
// io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));



/*export default io;
require('./sockets/socket');*/

// getAuthorizeUrl((err, url) => {
//     if (err) return console.log(err);
//     console.log("Auth url is: ", url);
// });


app.listen(port, () => {
    console.log(`Listening on ${port}`);
});