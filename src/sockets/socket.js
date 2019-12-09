import io from '../index';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Asistencia from '../models/Asistencia';
import { createVerify } from 'crypto';

io.on('connection', (socket) => {
    console.log('Usuario conectado');
    socket.emit('enviarMensaje', { usuario: 'Admin', mensaje: 'Bienvenido a esta App' });
    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    socket.on('sendMessage', (message) => {
        console.log('El cliente envio: ', message);
        io.emit('recieveMessage', 'Hola desde Ecuador');
    });


    socket.on('sendRange', (data, cb) => {
        let { id, radio, latitud, longitud } = data;
        validateRange(id, radio, latitud, longitud);
    });
    socket.on('ping', (latency) => {;
        socket.emit('pong');
    });
});




export async function validateRange(id, radio, latitud, longitud) {
    try {
        let dispositivo = await Dispositivo.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'nombre'],
            include: [{ model: Empleado, attributes: ['id'], include: { model: Empresa, attributes: ['radio'] } }]
        });


        let radioPermitido = dispositivo.empleado.empresa.radio;
        console.log('Permitio', radioPermitido);
        console.log('Actual', radio);


        if (radio > radioPermitido) {
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