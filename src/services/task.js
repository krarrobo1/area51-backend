import Temp from '../models/Temp';
import Asistencia from '../models/Asistencia';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

import io from '../index';



import redis from './redis-client';


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


                let active = io.sockets.sockets;
                // console.log({ active });
                // TODO: Revisar...
                let socketid = await redis.getAsync(`${empleadoid}`);
                let sesion = active[socketid];

                console.log({ sesion: sesion })
                if (sesion) {
                    console.log('Haciendo desconexion por CRONTASK');
                    sesion.disconnect();
                }

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