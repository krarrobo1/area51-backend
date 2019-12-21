/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';
import Asistencia from '../models/Asistencia';
import Temp from '../models/Temp';



redis.on('connect', () => {
    console.log('Redis Up!');
});


io.on('connection', async (client) => {
    const connId = client.id;
    // reconeccion desconeccion


    console.log(`Nueva coneccion.. connId: ${connId}`);
    client.on('isValid', async (data) => {
        console.log('ISVALID!');
        try {
            let objTemp = JSON.parse(data);

            if (objTemp) {
                let { empleadoid } = objTemp;
                console.log('Empezando a trabajar...');
                console.log(`empleadoid: ${empleadoid} socketid: ${connId}`);
                // Guardamos el id del usuario

                let temp = { socketid: connId, recdec: false };


                await redis.setAsync(`${empleadoid}`, JSON.stringify(temp));
                // Guardamos el id del socket y el del usuario;
                await redis.setnxAsync(connId, data);
                client.emit('valid', true);
            }

        } catch (err) {
            console.log(`ERROR: ${err}`);
        }
    });

    // Se desencadena cuando el cliente se reconecta desde su bucle
    client.on('isReconnected', async(data) =>{
        console.log('RECONECTADO AUTOMATICAMENTE...!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        try {
            let objTemp = JSON.parse(data);

            if (objTemp) {
                let { empleadoid } = objTemp;
                console.log('Empezando a trabajar...');
                console.log(`empleadoid: ${empleadoid} socketid: ${connId}`);
                // Guardamos el id del usuario
                let temp = { socketid: connId, recdec: false };
                await redis.setAsync(`${empleadoid}`, JSON.stringify(temp));
                // Guardamos el id del socket y el del usuario;
                await redis.setnxAsync(connId, data);
                // client.emit('valid', true);
            }

        } catch (err) {
            console.log(`ERROR: ${err}`);
        }

    })

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

    client.on('reconnect', () => {
        console.log(`USUARIO RECONECTADO ${key}`);
        client.emit('reconectar', ('Reconectando...'));

    })
    client.on('salidaLimitesEmpresa', async () => {
        client.disconnect(true);
        let data = await redis.getAsync(connId);
        let registro = JSON.parse(data);


        await redis.delAsync(registro.empleadoid);
    });

    client.on('salidaPorRegistro', async () => {
        client.disconnect(true);
        // Cambio
        try {
            let data = await redis.getAsync(connId);
            let registro = JSON.parse(data);

            if (registro) {
                let temp = { socketid: connId, recdec: true };
                // Actualizamos la key con un timer....
                await redis.setexAsync(`${registro.empleadoid}`, 60 * 4, JSON.stringify(temp));
            }



        } catch (err) {
            console.log(err);
        }



    });

    client.on('disconnect', async (reason) => {

        let nodata = false;

        try {
            console.log(`El usuario ${connId} se desconecto por ${reason.toUpperCase()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            let data = await redis.getAsync(connId);
            let registro = JSON.parse(data);
            if (registro) console.log(`redis user data:`, { data: registro });
            else nodata = true;



            // If reconnect ? Mantener ID usuario

            // Borramos id del usuario CAMBIAMOS EL ESTADO
            //if (registro !== null) await redis.setAsync(`${registro.empleadoid}`, key);
            // Si el usuario se desconecto voluntariamente elimina su info de salida del redis
            if (reason === 'client namespace disconnect') {
                console.log('Desconeccion voluntaria: ', connId);
                await redis.delAsync(connId);
            } else if (reason === 'server namespace disconnect') {
                console.log('El server desconecto al cliente', connId);
                // Reconexion y desconexion? 
                await redis.delAsync(connId);
            } else if (reason === 'transport error') {
                console.log('Transport error');
                await redis.delAsync(connId);
            } else { // transport close, ping timeout // Cliente cierra app, Cliente se queda sin internet
                if (nodata === false) {
                    console.log(`Esperando a  3 min a que se reconecte... connId: ${connId}!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                    setTimeout(async () => {
                        try {
                            // let data = await redis.getAsync(key);
                            // let registro = JSON.parse(data);
                            if (registro) {

                                let keyActual = await redis.getAsync(`${registro.empleadoid}`);
                                console.log({ keyActual });

                                let { socketid, recdec } = JSON.parse(keyActual);


                                // TODO: OBTENER OBJETO DEL REDIS Y VERIFICAR SI HIZO RECONECCION Y DESCONECCION

                                // if key != key

                                if (connId !== socketid) {
                                    console.log(`SE RECONECTO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                                    //await redis.delAsync(registro.empleadoid);
                                } else {
                                    console.log('TIEMPO DE ESPERA FINALIZADO..!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                    if (recdec == false) {
                                        //registrarSalida(registro);
                                        console.log('Registrando salida!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                        await redis.delAsync(registro.empleadoid);
                                    } else {
                                        'El usuario ya salio previamente..'
                                    }
                                }
                                // let reconnect = await redis.getAsync(`${registro.empleadoid}`);
                                // console.log('reconnect: ', reconnect);
                                // if (!reconnect) {
                                //     if(reconnect)
                                //     console.log('Tiempo de espera finalizado....')
                                //     registrarSalida(registro);
                                // }
                                // else if (recdes){ console.log('El usuario se ha reconectado y salido') }
                                // else console.log(`El usuario se ha reconectado ${registro.empleadoid} ${reconnect}`);
                            }
                        } catch (err) {
                            console.log(`ERROR: ${err}`);
                        } finally {
                            await redis.delAsync(connId);
                        }
                    }, 190000); // 3 minutos
                } else {
                    console.log('NO ESPERES, NO TIENE DATOS EN REDIS');
                }

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

            await Temp.destroy({
                where: {
                    empleadoid
                }
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