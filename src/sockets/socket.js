import io from '../index';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Asistencia from '../models/Asistencia';


let conectados = [];

io.on('connection', (socket) => {

    console.log('Usuario conectado', socket.id);

    socket.on('entrar', (data) => {
        // let obj = data;
        // obj.id = socket.id;

        // conectados.push(obj);

        // console.log(conectados);
    });


    socket.on('myid', data => console.log(data));

    socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.id);
    });

    socket.on('disconnecting', (reason) => {
        console.log(reason);
        if (reason === 'transport close') {
            console.log('Intempestivamente');
            setTimeout(() => {
                console.log('Salida registrada');
            }, 30000)
        }
        // ...
    });

    socket.on('send', (data) => {
        let obj = data;
        obj.id = socket.id;

        conectados.push(obj);

        console.log(conectados);
    });

    socket.on('reconnect', () => {
        console.log('Usuario reconectado: ', socket.id);
    });

    socket.on('sendMessage', (data) => {
        console.log(socket.id, 'Dice ', data);
    });

    socket.on('locationData', (data, cb) => {
        // let { userid, deviceid, rango, latitud, longitud } = data;
        console.log(data);


    });

});




// export async function validateRange(id, rango, latitud, longitud) {
//     try {
//         /*let dispositivo = await Dispositivo.findOne({
//             where: {
//                 id: id
//             },
//             attributes: ['id', 'nombre'],
//             include: [{ model: Empleado, attributes: ['id'], include: { model: Empresa, attributes: ['radio'] } }]
//         });*/
//         let empleado = await Empleado.findOne({
//             where: {
//                 id
//             },
//             include: [{ model: Empresa, attributes: ['radio'] }]
//         });


//         let radioPermitido = empleado.empresa.radio;
//         console.log('Permitido', radioPermitido);
//         console.log('Actual', rango);


//         if (rango > radioPermitido) {
//             console.log('Out of Range');
//             const nuevaAsistencia = await Asistencia.create({
//                 dispositivoid: id,
//                 hora: new Date,
//                 latitud,
//                 longitud,
//                 eventoid: 2
//             }, {
//                 fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
//             });
//             console.log(JSON.stringify(nuevaAsistencia, null, 2));
//         }
//     } catch (err) {
//         console.log(err);
//     }
// }