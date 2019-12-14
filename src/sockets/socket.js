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
    let key = client.id;
    console.log('Usuario conectado: ', key);


    client.on('data', async (data) => {
        await redis.setnx(client.id, JSON.stringify(data));
        console.log('Client: ', client.id,data);
        let { enRango } = JSON.parse(data);
        console.log(enRango);
        if (enRango === false) {
            registrarSalida(data);
            client.disconnect(true);
        }
        // let exists = await redis.exists(key);
        // console.log(exists);


    });

    client.on('salida', async (data) => {
        client.disconnect(true);
    });

    client.on('reconnect',async(data) =>{
        console.log('Reconectado');
    });

    client.on('disconnect', async (reason) => {
        console.log('Usuario desconectado', client.id);
        let key = client.id;
        console.log(`El usuario ${key} se desconecto por ${reason}`);

        if(reason === 'server namespace disconnect'){
            redis.del(key);
        }else{
            console.log('Esperalo')
            setTimeout(() => {
                redis.get(key, (err, data) => {
                    if (err) console.log(err);
                    registrarSalida(data);
                });
                redis.del(key);
            }, 60000);
        }

    });
});

async function registrarSalida(data) {
    if(data){
        /*let { latitud, longitud, empleadoid, dispositivoid } = data;
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
        console.log(`Salida ${salida}`);*/
        console.log('SALIDA', data)
    }
}