/*-----------------------------------
            SOCKET SERVER
-------------------------------------*/
import io from '../index';
//import redis from '../services/redis-client';
import Asistencia from '../models/Asistencia';



redis.on('connect', () => {
    console.log('Redis up');
})


io.on('connection', async (client) => {
    let key = client.id;
    console.log('Usuario conectado: ', key);


    client.on('data', async (data) => {
        // Si ya existe no lo guardes denuevo...
        await redis.setnx(client.id, JSON.stringify(data));
        //El cliente se ha conectado
        console.log('Client: ', client.id,data);

        let { enRango, empleadoid} = JSON.parse(data);

        console.log(empleadoid);
        // Guardamos el id del usuario;
        await redis.setnx(`${empleadoid}`, `${client.id}`);
    
        // Si sale del rango de la empresa
        if (enRango === false) {
            console.log('Ha salido del rango');
            // Se registra su salida
            registrarSalida(data);

            // Desconectar al cliente...
            client.disconnect(true);
        }
    });

    client.on('salida', async (data) => {
        client.disconnect(true);
    });

    client.on('reconnect',async(data) =>{
        console.log('Reconectado');
    });

    client.on('disconnect', async (reason) => {
        console.log('Usuario desconectado', client.id);
        
        // Id del socket
        let key = client.id;

        // Data del socket
        
       
       
        
        
        console.log(`El usuario ${key} se desconecto por ${reason}`);
       


        redis.get(key, (err, data) =>{
            if(err) console.log(err);
            // Data parseada

          
            let str= JSON.parse(data);

            let userData = JSON.parse(str);
            
            if(userData){
                console.log(userData);
                redis.del(`${userData.empleadoid}`);
            }
            

        });

    
        
        
        

        // Si el usuario se desconecto voluntariamente elimina su key del redis
        if(reason === 'server namespace disconnect'){
            console.log('Desconeccion voluntaria: ', key);
            redis.del(key);
        }else{
            console.log('Esperar a que se reconecte', key);
            setTimeout(async() => {
                try{
                   
                    redis.get(key, async(err, data) =>{
                        if(err) throw err;
                        
                        // Data parseada
                        let str= JSON.parse(data);
                        let userData = JSON.parse(str);

                        if(userData){
                            redis.get(`${userData.empleadoid}`, (err, data)=>{
                                if(err) console.log(err);
                                if(data === null){
                                   registrarSalida(userData);
                                }else{
                                    console.log('se volvio a conectar');
                                }
                            });
                        }

                        redis.del(key);
                    });
                    
                }catch(err){
                    console.log(err);
                }
            }, 60000);
            console.log('despues: ');
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