/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';
import Asistencia from '../models/Asistencia';
import Temp from '../models/Temp';

import { obtenerUltimoEvento } from '../controllers/asistencia.controller';



redis.on('connect', () => {
    console.log('Redis Up!');
});


io.on('connection', async(client) => {
    const connId = client.id;
    // reconeccion desconeccion




    console.log(`Nueva coneccion.. connId: ${connId}`);
    client.on('isValid', async(data) => {
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
    client.on('isReconnected', async(data) => {
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

    client.on('salidaLimitesEmpresa', async() => {
        console.log('SALIO DE LA EMPRESA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        client.disconnect(true);
    });

    client.on('salidaPorRegistro', async() => {
        client.disconnect(true);
    });

    client.on('disconnect', async(reason) => {

        let nodata = false;

        try {
            console.log(`El usuario ${connId} se desconecto por ${reason.toUpperCase()}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
            console.log(`${reason.toUpperCase()}`);
            let data = await redis.getAsync(connId);
            let registro = JSON.parse(data);
            if (registro) console.log(`redis user data:`, { data: registro });
            else nodata = true;




            if (reason === 'client namespace disconnect') {
                console.log('Desconeccion voluntaria: ', connId);
                await redis.delAsync(connId);
            } else if (reason === 'server namespace disconnect') {
                console.log('El server desconecto al cliente', connId);
                if (registro) {
                    let temp = { socketid: connId, recdec: true };
                    await redis.setexAsync(`${registro.empleadoid}`, 60 * 4, JSON.stringify(temp));
                    await redis.delAsync(connId);
                }

            } else if (reason === 'transport error') {
                console.log('Transport error');
                await redis.delAsync(connId);
            } else { // transport close, ping timeout // Cliente cierra app, Cliente se queda sin internet
                if (nodata === false) {
                    console.log(`Esperando a  3 min a que se reconecte... connId: ${connId}!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                    setTimeout(async() => {
                        console.log('TIMEOUT........!!!!');
                        try {
                            if (registro) {
                                let keyActual = await redis.getAsync(`${registro.empleadoid}`);

                                let { socketid, recdec } = JSON.parse(keyActual);

                                if (connId === socketid && recdec === false) {
                                    console.log('Registrando salida.......!!!');
                                    registrarSalida(registro);
                                }


                                // if (connId !== socketid) {
                                //     console.log(`SE RECONECTO!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
                                // } else {
                                //     console.log('TIEMPO DE ESPERA FINALIZADO..!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                //     if (recdec == false) {
                                //         registrarSalida(registro);
                                //         console.log('Registrando salida!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                                //         await redis.delAsync(registro.empleadoid);
                                //     } else {
                                //         'El usuario ya salio previamente..'
                                //     }
                                // }

                            }
                        } catch (err) {
                            console.log(`ERROR: ${err}`);
                        } finally {
                            await redis.delAsync(connId);
                        }
                    }, 190000); // 3 minutos 
                }
                // else {
                //     console.log('NO ESPERES, NO TIENE DATOS EN REDIS');
                // }

            }

        } catch (err) {
            console.log(`ERROR: ${err}`);
        }

    });
});





async function registrarSalida(data) {
    if (data) {

        try {

            let { latitud, longitud, empleadoid, dispositivoid } = data;
            let event = await obtenerUltimoEvento(empleadoid);
            console.log({ event });

            if (event === 2) {
                console.log('Registrando salida de :', { data });
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

            }

        } catch (err) {
            console.log(`ERROR: ${err.message}`);
        }

    }
}