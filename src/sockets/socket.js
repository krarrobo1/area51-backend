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
    const connId = client.id;
    console.log(`Nueva coneccion.. connId: ${connId}`);
    client.on('isValid', async (data) => {
        try{
            let objTemp = JSON.parse(data);
            let { empleadoid } = objTemp;
            console.log('Empezando a trabajar...');
            console.log(`empleadoid: ${empleadoid} socketid: ${connId}`);
            // Guardamos el id del usuario
            await redis.setnxAsync(`${empleadoid}`, connId);
            // Guardamos el id del socket y el del usuario;
            await redis.setnxAsync(connId, data);
            client.emit('valid', true);
        }catch(err){
            console.log(`ERROR: ${err}`);
        }
    });

    // client.on('data', async (data) => {
    //     try {
    //         // Guardar info del usuario.
    //         let objTemp = JSON.parse(data);
    //         let { enRango, empleadoid } = objTemp;
    //         await redis.setnxAsync(key, data);

    //         //El cliente se ha conectado
    //         console.log(`El Cliente con id: ${empleadoid} envio una trama`, key, data);

    //         // Si sale del rango de la empresa desconectarlo 
    //         if (enRango === false) {
    //             console.log(`El Cliente con id: ${empleadoid} salio de la empresa`);
    //             registrarSalida(objTemp);

    //             // Verificar si es viable;
    //             client.disconnect(true);
    //         }
    //     } catch (err) {
    //         console.log(`ERROR: ${err}`);
    //     }
    // });


    client.on('disconnect', async (reason) => {
        try {
            console.log(`El usuario ${connId} se desconecto por ${reason}`);
            let data = await redis.getAsync(connId);
            let registro = JSON.parse(data);
            console.log(`redis user data:`, {data: registro});

            // Borramos id del usuario
            if (registro !== null) await redis.delAsync(`${registro.empleadoid}`);
            // Si el usuario se desconecto voluntariamente elimina su key del redis
            if (reason === 'client namespace disconnect') {
                console.log('Desconeccion voluntaria: ', connId);
                await redis.delAsync(connId);
            } else if (reason === 'server namespace disconnect') {
                console.log('El server desconecto al cliente', connId);
                await redis.delAsync(connId);
            }else if(reason === 'transport error'){
                console.log('Transport error');
                await redis.delAsync(connId);
            }
            else { // transport close, ping timeout // Cliente cierra app, Cliente se queda sin internet
                console.log(`Esperando a ${registro.empleadoid} 1 min a que se reconecte... connId: ${connId}`);
                setTimeout(async () => {
                    try {
                        // let data = await redis.getAsync(key);
                        // let registro = JSON.parse(data);
                        if (registro) {
                            let reconnect = await redis.getAsync(`${registro.empleadoid}`);
                            console.log('reconnect: ', reconnect);
                            if (!reconnect) {
                                console.log('Tiempo de espera finalizado....')
                                registrarSalida(registro);
                            }
                            else console.log(`El usuario se ha reconectado ${registro.empleadoid} ${reconnect}`);
                        }
                    } catch (err) {
                        console.log(`ERROR: ${err}`);
                    } finally {
                        await redis.delAsync(connId);
                    }
                }, 60000);
            }

        } catch (err) {
            console.log(`ERROR: ${err}`);
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
            console.log('Salida registrada satisfactoriamente...');
            // console.log({
            //     ok: true,
            //     data: salida
            // });
        } catch (err) {
            console.log(`ERROR: ${err.message}`);
        }

    }
}