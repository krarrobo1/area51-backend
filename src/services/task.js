import Temp from '../models/Temp';
import Asistencia from '../models/Asistencia';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';

export async function marcarSalidas(){
    let now = dt.format(Date.now(), 'HH:mm:ss', { locale: es });

    console.log('Registrando salidas...', now);
    // Encuentra todos aquellos empleados que tienen horario hasta ahora ...
    // let temps = Temp.findAll({
    //     where: {
    //         horafin: now
    //     }
    // });

    // let records = [];
    // if(temps.length  !== 0){
    //     temps.forEach((temp) =>{
    //         let {empleadoid, dispositivoid, latitud, longitud} = temp;
    //         let eventoid = 2;
    //         let objTemp = {empleadoid, dispositivoid, latitud, longitud, eventoid, hora: new Date};
    //         records.push(objTemp);
    //     });
    // }
    // if(records.length !== 0){
    //     let data = await Asistencia.bulkCreate(records, {fields: ['empleadoid', 'dispositivoid', 'latitud', 'longitud', 'eventoid', 'hora']});
    //     console.log(`Resultado: ${data}`);
    // }
    
}