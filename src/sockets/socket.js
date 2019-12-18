/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';
import Asistencia from '../models/Asistencia';



redis.on('connect', () => {
    console.log('Redis Up!');
});


io.on('connection', async (client) => {
    const key = client.id;

    console.log('Usuario conectado: ', key);

    client.on('isValid', async (id) => {
        // Guardamos el id del usuario;
        await redis.setnxAsync(id, key);
        client.emit('valid', true);
    });

    client.on('data', async (data) => {
        try {
            // Guardar info del usuario.
            let objTemp = JSON.parse(data);
            let { enRango, empleadoid } = objTemp;
            await redis.setnxAsync(key, data);

            //El cliente se ha conectado
            console.log(`El Cliente con id: ${empleadoid} envio una trama`, key, data);

            // Si sale del rango de la empresa desconectarlo 
            if (enRango === false) {
                console.log(`El Cliente con id: ${empleadoid} salio de la empresa`);
                registrarSalida(objTemp);

                // Verificar si es viable;
                client.disconnect(true);
            }
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    });


    client.on('disconnect', async (reason) => {
        try {
            console.log(`El usuario ${key} se desconecto por ${reason}`);
            let data = await redis.getAsync(key);
            let registro = JSON.parse(data);
            console.log(`redis user data:`, {data: registro});
            if(registro) await redis.delAsync(`${registro.empleadoid}`);
        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
        // Si el usuario se desconecto voluntariamente elimina su key del redis
        if (reason === 'client namespace disconnect') {
            console.log('Desconeccion voluntaria: ', key);
            await redis.delAsync(key);
        } else if (reason === 'server namespace disconnect') {
            console.log('El server desconecto al cliente', key);
            // Se puede hacer In range OUT?
            await redis.delAsync(key);
        }
        else {
            console.log('Espera 1 min a que se reconecte', key);
            setTimeout(async () => {
                try {
                    let data = await redis.getAsync(key);
                    let registro = JSON.parse(data);
                    if (registro) {
                        let reconnect = await redis.getAsync(`${registro.empleadoid}`);
                        if (!reconnect) registrarSalida(registro);
                        else console.log(`El usuario se ha reconectado ${registro.empleadoid}`);
                    }
                    await redis.delAsync(key);
                } catch (err) {
                    console.log(`ERROR: ${err}`);
                }
            }, 60000);
        }
    });
});

async function registrarSalida(data) {
    if (data) {
        console.log('Registrando salida de :', { data });
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
            console.log({
                ok: true,
                data: salida
            });
        } catch (err) {
            console.log(`ERROR: ${err.message}`);
        }

    }
}