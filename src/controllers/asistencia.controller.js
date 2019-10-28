import Asistencia from '../models/Asistencia';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Evento from '../models/Evento';


import { sequelize } from '../database/database';
import { QueryTypes } from 'sequelize';


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
        res.status(500).json({ ok: false, err });
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
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
}