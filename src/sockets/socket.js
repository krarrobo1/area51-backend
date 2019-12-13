/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';


redis.on('connect', () => {
    console.log('Redis up');
})


io.on('connection', async (client) => {
    let key = client.id;
    console.log('Usuario conectado: ', key);


    client.on('data', async (data) => {
        await redis.setnx(client.id, JSON.stringify(data));
        console.log('Client: ', data);
        let { enRango } = data;
        if (enRango === false) {
            registrarSalida(data);
        }
        // let exists = await redis.exists(key);
        // console.log(exists);


    });

    client.on('salida', async (data) => {
        client.disconnect(true);
    });

    client.on('reconnect')

    client.on('disconnect', async (reason) => {
        console.log('Usuario desconectado', client.id);
        let key = client.id;
        console.log(`El usuario ${key} se desconecto por ${reason}`);

        if(reason === 'server namespace disconnect'){
            redis.get(key, (err, data) =>{
                if (err) console.log(err);
                registrarSalida(data);
            });

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
    let { latitud, longitud, usuarioid, dispositivoid } = data;
    console.log('Salida: ',data);
}