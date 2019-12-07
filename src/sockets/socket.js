import io from '../index';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Asistencia from '../models/Asistencia';

io.on('connection', (client) => {
    console.log('Usuario conectado');
    client.emit('enviarMensaje', { usuario: 'Admin', mensaje: 'Bienvenido a esta App' });
    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('enviarMensaje', (mensaje, cb) => {
        console.log(mensaje);
    });

    client.on('imhere', (data, cb) => {
        let { id, range } = data;
        validateRange(id, range);
    });
});


export async function validateRange(id, radio) {
    let employee = await Dispositivo.findOne({
        where: {
            id: id
        },
        attributes: ['id', 'nombre'],
        include: [{ model: Empleado, attributes: ['id'], include: { model: Empresa, attributes: ['radio'] } }]
    });

    let radioPermitido = employee.empresa.radio;

    if (radio > radioPermitido) {
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid: id,
            hora: new Date,
            latitud,
            longitud,
            eventoid: 2
        }, {
            fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
    }
}