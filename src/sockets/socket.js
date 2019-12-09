import io from '../index';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Asistencia from '../models/Asistencia';
import { CLIENT_RENEG_LIMIT } from 'tls';



io.on('connection', (socket) => {
    console.log('Usuario conectado');
    console.log(socket.id);
    socket.emit('enviarMensaje', { usuario: 'Admin', mensaje: 'Bienvenido a esta App' });





    socket.on('disconnect', () => {
        console.log('Usuario desconectado');

        console.log(socket.id);

    });

    socket.on('reconnect', () =>{
        console.log('Usuario reconectado: ',socket.id);
    });

    socket.on('msg', (message) => {
        console.log('El cliente envio: ', message);
        io.emit('recieveMessage', 'Hola desde Ecuador');
    });


    socket.on('locationData', (data, cb) => {
        let { id, rango, latitud, longitud } = data;
        console.log(data);
        // validateRange(id, rango, latitud, longitud);
    });
    socket.on('ping', (latency) => {;
        socket.emit('pong');
    });
});




export async function validateRange(id, rango, latitud, longitud) {
    try {
        /*let dispositivo = await Dispositivo.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'nombre'],
            include: [{ model: Empleado, attributes: ['id'], include: { model: Empresa, attributes: ['radio'] } }]
        });*/
        let empleado = await Empleado.findOne({
            where: {
                id
            },
            include: [{ model: Empresa, attributes: ['radio'] }]
        });


        let radioPermitido = empleado.empresa.radio;
        console.log('Permitido', radioPermitido);
        console.log('Actual', rango);


        if (rango > radioPermitido) {
            console.log('Out of Range');
            const nuevaAsistencia = await Asistencia.create({
                dispositivoid: id,
                hora: new Date,
                latitud,
                longitud,
                eventoid: 2
            }, {
                fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
            });
            console.log(JSON.stringify(nuevaAsistencia, null, 2));
        }
    } catch (err) {
        console.log(err);
    }
}