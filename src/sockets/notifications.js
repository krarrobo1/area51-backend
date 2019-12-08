import io from '../index';

const ns = io.of('/notifications');

ns.on('connection', (socket) => {
    console.log('Conectado al canal de notificaciones...');

    socket.on('permiso', (data) => {

    });
});


async function enviarNotificacion() {

}