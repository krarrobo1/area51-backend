import io from '../index';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';

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


export async function validateRange(id, range) {
    let employee = await Dispositivo.findOne({
        where: {
            id: id
        },
        include: [{ model: Empleado, attributes: ['id', 'empresaid'], include: { model: Empresa, attributes: ['radio'] } }]
    });

    console.log('Employee', employee);
}