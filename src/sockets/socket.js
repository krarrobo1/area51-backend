import io from '../index'
io.on('connection', (client) => {
    console.log('Usuario conectado');
    client.emit('enviarMensaje', { usuario: 'Admin', mensaje: 'Bienvenido a esta App' });
    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('enviarMensaje', (mensaje, cb) =>{
        console.log(mensaje);
    });

    client.on('imhere',(msj, cb) =>{
        console.log(msj);
        // timer
        if(msj.message == 'Im here'){
            console.log('in range')
        }
    });
});