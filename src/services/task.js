import Temp from '../models/Temp';
import Asistencia from '../models/Asistencia';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

import redis from './redis-client';
import { cerrarSesion } from '../sockets/socket'

export async function marcarSalidas() {
    let now = dt.format(Date.now(), 'HH:mm:ss', { locale: es });

    console.log('Registrando salidas...', now);
    // Encuentra todos aquellos empleados que tienen horario hasta ahora ...
    try {
        let temps = await Temp.findAll({
            where: {
                horafin: now
            }
        });

        if (temps.length !== 0) {
            temps.forEach(async(temp) => {
                let { id, empleadoid, dispositivoid, latitud, longitud } = temp;
                let eventoid = 2;
                let objTemp = { empleadoid, dispositivoid, latitud, longitud, eventoid };


                // Obtener sesiones activas de redis con el id del usuario

                // let appClient = await redis.getAsync(`${id}`);

                // if (appClient !== null) {
                //     // OP1 Cambia el id del socket para que no le registre la salida al finalizar la app.
                //     let temp = { socketid: 'srvdisconnect', recdec: true };
                //     await redis.setexAsync(`${registro.empleadoid}`, 90, JSON.stringify(temp));

                //     // OP2 Busca la sesion del usuario con empleadoid y la termina...
                //     let confirm = await cerrarSesion(empleadoid);
                //     confirm ? console.log('Se cerro la sesion...') : console.log('No se encontro la sesion...');
                // }



                // Registra las salidas pendientes del cierre de horario laboral.
                await crearAsistencia(objTemp);
                // Elimina las salidas pendientes
                await Temp.destroy({ where: { id } });

            });
        }
    } catch (err) {
        console.log(err);
    }
}


async function crearAsistencia(objTemp) {
    let { empleadoid, dispositivoid, latitud, longitud, eventoid } = objTemp;
    const asistencia = await Asistencia.create({
        dispositivoid,
        empleadoid,
        hora: new Date,
        latitud,
        longitud,
        eventoid
    }, {
        fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
    });

    return asistencia;
}