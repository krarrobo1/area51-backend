import { crearAsistencia } from '../controllers/asistencia.controller';
import Temp from '../models/Temp';
import redis from '../services/redis-client';



export async function stillActive() {
    try {
        setTimeout(async() => {
            let temps = await Temp.findAll({});
            temps.forEach(async(temp) => {
                let { id, empleadoid, dispositivoid, latitud, longitud } = temp;
                let eventoid = 2;
                let objTemp = { empleadoid, dispositivoid, latitud, longitud, eventoid };


                let exists = await redis.existsAsync(`${empleadoid}`);
                if (exists == 0) {
                    await crearAsistencia(objTemp);
                    await Temp.destroy({ where: { id } });
                } else {
                    console.log(empleadoid, 'Sigue activo');
                }

            });
        }, 3000)
    } catch (err) {
        console.log(`Error: ${err}`);
    }
}