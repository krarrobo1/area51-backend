import Asistencia from '../models/Asistencia';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Evento from '../models/Evento';

import Cargo from '../models/Cargo';
import Periodo from '../models/Periodo';
import Dia from '../models/Dia'


import stream from 'stream';

import { crearExcel } from '../services/reportes';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';
import { sequelize } from '../database/database';
import { QueryTypes } from 'sequelize';





export async function registrarAsistencia(req, res, next) {
    const { id } = req.data;
    const { dispositivoid, latitud, longitud, eventoid } = req.body;
    try {
        const dispositivos = await Dispositivo.findAll({
            raw: true,
            where: {
                empleadoid: id
            }
        });
        if (dispositivos.length == 0) return res.status(404).json({ ok: false, message: 'EmpleadoSinDispositivos' });
        let selected = dispositivos.filter((dispositivo) => {
            if (dispositivo.id === dispositivoid) {
                return dispositivo;
            }
        });
        if (selected.length === 0) return res.status(404).json({ ok: false, message: 'EquipoNoEncontrado' });
        if (!selected[0].estado) return res.status(401).json({ ok: false, message: `EquipoInactivo` });
        //dispositivos.some((value) => value.id === dispositivoid);
        //if (!flag) return res.status(404).json({ ok: false, message: 'EquipoNoEncontrado' });

        // Si el dispositivo.estado == false no puede registrarlo 

        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { id },
            include: [{ model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }]
        });

        // Si no tiene asignado un horario throw Error...

        let periodoLaboral = empleado.cargo.periodos;
        // Si esta dentro del periodo puede registrarse...
        if (!comprobarPeriodoLaboral(periodoLaboral)) return res.status(400).json({ ok: false, err: { message: 'FueraDeHorario' } })
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            empleadoid: id,
            hora: new Date,
            latitud,
            longitud,
            eventoid
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
        return res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        next(err);
    }
};


export async function registrarAsistenciaWeb(req, res, next) {
    const { empleadoid, dispositivoid, latitud, longitud, eventoid } = req.body;
    try {
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { id },
            include: [{ model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }]
        });

        let periodoLaboral = empleado.cargo.periodos;
        // Si esta dentro del periodo puede registrarse...
        if (!comprobarPeriodoLaboral(periodoLaboral)) return res.status(400).json({ ok: false, err: { message: 'FueraDeHorario' } })
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            empleadoid: id,
            hora: new Date,
            latitud,
            longitud,
            eventoid
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
        return res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        next(err);
    }
}



export async function obtenerAsistencia(req, res, next) {
    const { id } = req.params;
    try {
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
        next(err);
    }
}

export async function obtenerAsistenciaEmpleadoId(req, res, next) {
    const { id } = req.params;

    try {
        let data = await sequelize.query(`Select 
        asis.latitud,
		asis.longitud,
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

        data.forEach(element => {
            let { timest } = element;
            let formated = dt.format(timest, 'dd/MM/yyyy HH:mm:ss');
            element.formatedDate = formated;
        });

        return res.json({ ok: true, data })
    } catch (err) {
        next(err);
    }
}





export async function descargarReporteAsistencias(req, res, next) {
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


        let bf = await crearExcel(registros);
        if (!bf) return res.status(500).json({ ok: false, err: { message: `(Sin registros) No se pudo completar la accion...` } });
        let { nombres } = registros[0];
        // Bufer del Excel
        let fileContents = Buffer.from(bf, "base64");

        // Se crea un flujo de lectura
        let readStream = new stream.PassThrough();

        // Se termina de escribir el archivoen el flujo de lectura
        readStream.end(fileContents);


        let title = new Date().getMilliseconds() * 369;
        res.set('Content-disposition', `attatchment; filename = registro-${nombres}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Se crea un pipe hacia la respuesta
        readStream.pipe(res);

        readStream.on('error', () => {
            return res.status(500).json({
                ok: false,
                message: 'Algo salio mal...'
            });
        });

        readStream.on('finish', () => {
            console.log('TODO OK!');
            return
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ ok: false, err });
    }
}


/*export async function descargarReporteAsistencias(req, res, next) {
    const { id } = req.params;

    const query = `SELECT CONCAT (emp.nombres,' ',emp.apellidos) nombres , emp.ci,  CONCAT(asis.latitud,',', asis.longitud) ubicacion, asis.hora timest,disp.nombre dispositivo, evt.nombre evento 
    FROM asistencias asis
    INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
    INNER JOIN empleados emp ON disp.empleadoid = emp.id
    INNER JOIN eventos evt ON asis.eventoid = evt.id
    WHERE emp.id = ${id}
    ORDER BY timest;`

    try {
        let registros = await sequelize.query(query, { type: QueryTypes.SELECT });
        let bf = await crearExcel(registros);
        if (!bf) return res.status(500).json({ ok: false, err: { message: `(Sin registros) No se pudo completar la accion...` } });
        let { nombres } = registros[0];
        // Bufer del Excel
        let fileContents = Buffer.from(bf, "base64");

        // Se crea un flujo de lectura
        let readStream = new stream.PassThrough();

        // Se termina de escribir el archivoen el flujo de lectura
        readStream.end(fileContents);


        let title = new Date().getMilliseconds() * 369;
        res.set('Content-disposition', `attatchment; filename = registro-${nombres}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        // Se crea un pipe hacia la respuesta
        readStream.pipe(res);

        readStream.on('error', () => {
            return res.status(500).json({
                ok: false,
                message: 'Algo salio mal...'
            });
        });

        readStream.on('finish', () => {
            console.log('TODO OK!');
            return
        });

    } catch (err) {
        next(err);
    }
}*/


/*function comprobarPeriodoLaboral(periodoLaboral) {
    return periodoLaboral.some((periodo) => {
        let { horainicio, horafin, dia } = periodo;

        let now = dt.format(Date.now(), 'EEEE HH:mm:ss', { locale: es }).split(' ');
        let diaCapitalized = now[0].charAt(0).toUpperCase() + now[0].slice(1);
        let horaActual = now[1];
        if (dia.nombre === diaCapitalized) {
            // 10 minutos antes de su hora inicial..
            let tiempoGracia = dt.subMinutes(new Date(`01/01/2020 ${horainicio}`), 10).toTimeString().split(' ')[0];
            if (Date.parse(`01/01/2020 ${tiempoGracia}`) < Date.parse(`01/01/2020 ${horaActual}`) && Date.parse(`01/01/2020 ${horafin}`) > Date.parse(`01/01/2020 ${horaActual}`)) {
                console.log('En horario..');
                return true;
            } else {
                return false;
            };
        } else {
            return false
        }
    });
}*/

function comprobarPeriodoLaboral(periodoLaboral) {
    let enhorario = false;

    let mockDate = '01/01/2019';

    let now = dt.format(Date.now(), 'EEEE HH:mm:ss', { locale: es }).split(' ');
    let diaActual = now[0].charAt(0).toUpperCase() + now[0].slice(1);
    console.log(diaActual);
    let horaActual = now[1];

    let count = 0;


    for (let i = 0; i < periodoLaboral.length; i++) {
        const periodo = periodoLaboral[i];
        if (periodo.dia.nombre === diaActual) {
            console.log('Dia', periodo.dia);
            let hInicio = `${mockDate} ${periodo.horainicio}`;
            let hFin = `${mockDate} ${periodo.horafin}`;

            let hActual = `${mockDate} ${horaActual}`;

            // 10 minutos antes de que comience la jornada
            let tiempoGracia = dt.subMinutes(new Date(hInicio), 10).toTimeString().split(' ')[0];
            hInicio = `${mockDate} ${tiempoGracia}`;

            if (hInicio < hActual && hFin > hActual) {
                console.log('Dentro de horario...');
                enhorario = true;
                break;
            }
        }
    }
    console.log(enhorario);
    return enhorario;
}