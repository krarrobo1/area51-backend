/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
import redis from '../services/redis-client';


redis.on('connect', () => {
    console.log('Redis up');
})


io.on('connection', async(client) => {
    let key = client.id;
    console.log('Usuario conectado: ', key);


    client.on('data', async(data) => {

        console.log(data);
        let exists = await redis.exists(key);
        console.log(exists);

        await redis.setnx(client.id, JSON.stringify(data));
    });

    client.on('disconnect', async() => {
        console.log('Usuario desconectado', client.id);
        let key = client.id;

        setTimeout(() => {
            redis.get(key, (err, reply) => {
                if (err) console.log(err);
                console.log(reply);
            });
            console.log('Salida registrada');
            redis.del(key);
        }, 10000)
    });
});