import Asistencia from '../models/Asistencia';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Evento from '../models/Evento';


import { crearExcel } from '../services/reportes';
import { sequelize } from '../database/database';
import { QueryTypes } from 'sequelize';

import stream from 'stream';


export async function crearAsistencia(req, res) {
    const { id } = req.data;
    const { dispositivoid, latitud, longitud, eventoid } = req.body;
    const dispositivos = await Dispositivo.findAll({
        raw: true,
        where: {
            empleadoid: id
        }
    });
    if (dispositivos.length == 0) return res.status(404).json({ ok: false, message: 'No se han encontrado dispositivos vinculados a dicho empleado...' });

    let flag = false;
    for (let i = 0; i < dispositivos.length; i++) {
        const { id } = dispositivos[i];
        if (dispositivoid == id) {
            flag = true;
            break;
        }
    }
    if (!flag) return res.json({ ok: false, message: 'El id del dispositivo no coincide con el empleado' });
    // La hora es la hora local del server...
    try {
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            hora: new Date,
            latitud,
            longitud,
            eventoid
        }, {
            fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });

        res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
};

export async function obtenerAsistencia(req, res) {
    const { id } = req.params;
    let { month, year } = req.query;
    try {

        /*
        if (month) {
            let filtered = await sequelize.query(`SELECT * FROM ASISTENCIAS WHERE DISPOSITIVOID = ${id}
            AND EXTRACT(MONTH FROM hora) = ${month}`, { type: QueryTypes.SELECT });
            console.log(filtered);
            return res.json({ ok: true, filtered });
        }

        */


        const asistencias = await Asistencia.findAll({
            attributes: ['id', 'hora', 'latitud', 'longitud'],
            order: ['hora'],
            where: {
                dispositivoid: id
            },
            include: [
                { model: Dispositivo, attributes: ['id', 'nombre', 'ip', 'mac', 'modelo'], include: [{ model: Empleado, attributes: ['id', 'nombres', 'apellidos', 'ci'] }] },
                { model: Evento, attributes: ['nombre'] }
            ]
        });

        return res.json({ ok: true, data: asistencias });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

export async function obtenerAsistenciaEmpleadoId(req, res) {
    const { id } = req.params;

    try {
        let data = await sequelize.query(`Select CONCAT(emp.nombres,' ', emp.apellidos) nombres, 
        emp.ci,
        CONCAT(asis.latitud,',',asis.longitud) ubicacion,
        asis.hora timest,
        disp.nombre dispositivo, 
        evt.nombre evento
        FROM asistencias asis
        INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
        INNER JOIN empleados emp ON disp.empleadoid = emp.id
        INNER JOIN eventos evt ON asis.eventoid = evt.id
        WHERE emp.id = ${id}
        ORDER BY timest;
        `, { type: QueryTypes.SELECT });
        return res.json({ ok: true, data })
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }

    /* try {
         let asistencias = await obtenerAsistenciasEmpleado(id);
         return res.json({ ok: true, data: asistencias });
     } catch (err) {
         console.log(err);
         return res.status(500).json({ ok: false, err });
     }*/

}




// TODO: cambiar rutas, eliminar metodos no validos... TOmorrow es too
// export async function descargarReporteAsistencias(req, res) {
export async function descargarReporteAsistencias(req, res) {
    const { id } = req.params;
    try {
        let registros = await sequelize.query(`Select CONCAT(emp.nombres,' ', emp.apellidos) nombres, 
        emp.ci,
        CONCAT(asis.latitud,',',asis.longitud) ubicacion,
        EXTRACT(day FROM asis.hora) dia, 
        EXTRACT (month FROM asis.hora) mes,
        EXTRACT (year FROM asis.hora) anio,
        CONCAT(EXTRACT (HOUR from asis.hora),':',EXTRACT(MINUTE from asis.hora),':',EXTRACT(SECOND from asis.hora))hora,
        asis.hora timest,
        disp.nombre dispositivo, 
        evt.nombre evento
        FROM asistencias asis
        INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
        INNER JOIN empleados emp ON disp.empleadoid = emp.id
        INNER JOIN eventos evt ON asis.eventoid = evt.id
        WHERE emp.id = ${id}
        ORDER BY timest;
        `, { type: QueryTypes.SELECT });
        let string = JSON.stringify(registros);

        let bf = await crearExcel(JSON.parse(string));
        if (!bf) return res.status(500).json({ ok: false, err: { message: `(Sin registros) No se pudo completar la accion...` } });

        let fileContents = Buffer.from(bf, "base64");

        let readStream = new stream.PassThrough();
        readStream.end(fileContents);

        let title = new Date().getMilliseconds() * 369;

        res.set('Content-disposition', `attatchment; filename = registro.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        return readStream.pipe(res);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ ok: false, err });
    }
}