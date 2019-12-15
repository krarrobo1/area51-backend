/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';
import Asistencia from '../models/Asistencia';



redis.on('connect', () => {
    console.log('Redis up');
})


io.on('connection', async (client) => {

    const key = client.id;

    console.log('Usuario conectado: ', key);

    client.on('data', async (data) => {
        let { enRango, empleadoid } = data;
        await redis.setnx(key, JSON.stringify(data));

        //El cliente se ha conectado
        console.log(`El Cliente con id: ${empleadoid} envio una trama`, key, data);

        // Guardamos el id del usuario;
        await redis.setnx(`${empleadoid}`, `${key}`);

        // Si sale del rango de la empresa desconectarlo 
        if (enRango === false) {
            console.log('En rango?', enRango);
            client.disconnect(true);
            registrarSalida(data);
        }
    });


    client.on('salida', () => {
        client.disconnect(true);
    });



    client.on('disconnect', async (reason) => {
        
        console.log(`El usuario ${key} se desconecto por ${reason}`);

        // Elimina su empleadoid de redis
        redis.get(key, (err, data) => {
            if (err) console.log('Redis ERROR:', err);
            let userData = JSON.parse(data);
            if (userData) {
                redis.del(`${userData.empleadoid}`);
            }
        });


        // Si el usuario se desconecto voluntariamente elimina su key del redis
        if (reason === 'server namespace disconnect') {
            console.log('Desconeccion voluntaria: ', key);
            redis.del(key);
        } else {
            console.log('Espera 1 min a que se reconecte', key);
            setTimeout(() => {
                    redis.get(key,(err, data) => {
                        if (err) console.log('Redis Error:',err);
                        let userData = JSON.parse(data);
                        if (userData) {
                            redis.get(`${userData.empleadoid}`, (err, data) => {
                                if (err) console.log('Redis Error:',err);
                                if(!data) registrarSalida(userData);
                            });
                        }
                    });
                    redis.del(key);
            }, 60000);
        }
    });
});

async function registrarSalida(data) {
    if (data) {
        console.log('Registrando salida de :', data);

        let { latitud, longitud, empleadoid, dispositivoid } = data;

        try {
            let salida = await Asistencia.create({
                dispositivoid,
                empleadoid,
                hora: new Date,
                latitud,
                longitud,
                eventoid: 2
            }, {
                fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
            });
            console.log(`Salida registrada: data = ${salida}`);
        } catch (err) {
            console.log('Err: ', err.message);
        }

    }
}