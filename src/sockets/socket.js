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
        let { id, radio, latitud, longitud } = data;
        validateRange(id, radio, latitud, longitud);
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

        console.log(JSON.stringify(employee, null, 2));
        let radioPermitido = dispositivo.empleado.empresa.radio;
        console.log(radioPermitido);

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
    } catch (err) {
        console.log(err);
    }
}