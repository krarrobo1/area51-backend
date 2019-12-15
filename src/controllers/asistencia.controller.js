import Asistencia from '../models/Asistencia';
import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import Evento from '../models/Evento';
import Empresa from '../models/Empresa';

import Cargo from '../models/Cargo';
import Periodo from '../models/Periodo';
import Dia from '../models/Dia';
import Temp from '../models/Temp';


import stream from 'stream';
//import redis from '../services/redis-client';

import { createReport } from '../services/excelgenerator';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';
import { sequelize } from '../database/database';
import { QueryTypes } from 'sequelize';





export async function registrarAsistencia(req, res, next) {
    const { id } = req.data;
    const { dispositivoid, latitud, longitud } = req.body;
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

        let lastValue = await sequelize.query(`SELECT eventoid FROM ASISTENCIAS 
        WHERE EMPLEADOID = ${empleado.id}
        order by hora desc 
        limit 1;`, { type: QueryTypes.SELECT });


        let event = 1;
        console.log('LAST', JSON.stringify(lastValue, null, 2));

        if (lastValue.length > 0) {
            let evento = lastValue[0].eventoid;
            if (evento === 1) {
                event = 2;
            }
        }

        // Guardar en Temporales
        let horafin = getHoraSalida(periodoLaboral);

        if (event === 1) {
            let temp = Temp.create({
                horafin: horafin,
                latitud: empleado.empresa.latitud,
                longitud: empleado.empresa.longitud,
                dispositivoid,
                empleadoid: empleado.id
            }, {
                fields: ['dispositivoid', 'empleadoid', 'horafin', 'latitud', 'longitud']
            });

            console.log(temp);
        } else {
            await Temp.destroy({
                where: {
                    empleadoid: empleado.id
                }
            });
            console.log('deleted');
        }




        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            empleadoid: id,
            hora: new Date,
            latitud,
            longitud,
            eventoid: event
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
        return res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        next(err);
    }
};


export async function registrarAsistenciaWeb(req, res, next) {
    const { ci, dispositivoid } = req.body;
    try {
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { ci },
            include: [{ model: Empresa, attributes: ['latitud', 'longitud'] }, { model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }]
        });

        if (!empleado) return res.status(404).json({ ok: false, message: 'EmpleadoNoEncontrado' });


        let periodoLaboral = empleado.cargo.periodos;
        // Si esta dentro del periodo puede registrarse...
        if (!comprobarPeriodoLaboral(periodoLaboral)) return res.status(400).json({ ok: false, err: { message: 'FueraDeHorario' } })



        let lastValue = await sequelize.query(`SELECT  * FROM ASISTENCIAS 
        WHERE EMPLEADOID = ${empleado.id}
        order by hora desc 
        limit 1;`, { type: QueryTypes.SELECT });


        let event = 1;
        console.log('LAST', JSON.stringify(lastValue, null, 2));

        if (lastValue.length > 0) {
            let evento = lastValue[0].eventoid;
            if (evento === 1) {
                event = 2;
            }
        }

        // Guardar en Temporales
        let horafin = getHoraSalida(periodoLaboral);

        if (event === 1) {
            let temp = Temp.create({
                horafin: horafin,
                latitud: empleado.empresa.latitud,
                longitud: empleado.empresa.longitud,
                dispositivoid,
                empleadoid: empleado.id
            }, {
                fields: ['dispositivoid', 'empleadoid', 'horafin', 'latitud', 'longitud']
            });

            console.log(temp);
        } else {
            await Temp.destroy({
                where: {
                    empleadoid: empleado.id
                }
            });
            console.log('deleted');
        }





        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            empleadoid: empleado.id,
            hora: new Date,
            latitud: empleado.empresa.latitud,
            longitud: empleado.empresa.longitud,
            eventoid: event
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
        //nuevaAsistencia.dataValues.attribute = 'ABC';
        //  TODO: Nombre del Empleado
        // nombre del evento

        let evento = { nombre: '' };
        if (event === 1) {
            evento.nombre = 'Entrada';
        } else if (event === 2) {
            evento.nombre = 'Salida';
        }
        delete nuevaAsistencia.dataValues.eventoid;
        nuevaAsistencia.dataValues.evento = evento;


        return res.json({ ok: true, data: nuevaAsistencia });
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

    const QUERY = `SELECT ASIS.LATITUD, ASIS.LONGITUD, TO_CHAR(ASIS.HORA, 'dd/mm/yyyy HH24:MI:SS') formatedDate, asis.hora timest,DISP.NOMBRE dispositivo, EVENT.NOMBRE evento
    FROM ASISTENCIAS ASIS, DISPOSITIVOS DISP, EVENTOS EVENT
    WHERE 
    ASIS.EMPLEADOID = ${id}
    AND EVENT.ID = ASIS.EVENTOID
    AND DISP.ID = ASIS.DISPOSITIVOID
    ORDER BY timest`

    try {
        let data = await sequelize.query(QUERY, { type: QueryTypes.SELECT });
        return res.json({ ok: true, data })
    } catch (err) {
        next(err);
    }
}

export async function obtenerUltimasAsistenciasDelDia(req, res, next) {
    const { id } = req.params;
    let hoy = dt.format(Date.now(), 'dd/MM/yyyy');

    console.log(hoy);


    const QUERY = `SELECT ASIS.LATITUD, ASIS.LONGITUD, TO_CHAR(ASIS.HORA, 'dd/mm/yyyy HH24:MI:SS') formatedDate, asis.hora timest,DISP.NOMBRE dispositivo, EVENT.NOMBRE evento
    FROM ASISTENCIAS ASIS, DISPOSITIVOS DISP, EVENTOS EVENT
    WHERE 
    ASIS.EMPLEADOID = ${id}
    AND TO_CHAR(ASIS.hora, 'dd/mm/yyyy') = '${hoy}'
    AND EVENT.ID = ASIS.EVENTOID
    AND DISP.ID = ASIS.DISPOSITIVOID
    ORDER BY timest
    `;
    try {
        let asistencias = await sequelize.query(QUERY, { type: QueryTypes.SELECT });
        return res.json({ ok: true, data: asistencias });
    } catch (err) {
        next(err);
    }
}

export async function descargarReporteAsistencias(req, res, next) {
    // Obtiene id del url
    const { id } = req.params;
    try {
        const q1 = `SELECT CONCAT(emp.nombres,' ', emp.apellidos) nombres, ci,EMPR.NOMBRE empresa
        from empleados emp, empresas empr
        where emp.id = ${id}
        and emp.empresaid = empr.id`;
        let employee = await sequelize.query(q1, { type: QueryTypes.SELECT });

        if (employee.length === 0) return res.status(404).json({ ok: false, message: 'UsuarioNoEncontrado' });

        const q2 = `
        SELECT ASIS.HORA TIMEST, TO_CHAR(ASIS.HORA, 'HH24:MI:SS') hora, TO_CHAR(ASIS.HORA, 'dd/mm/yyyy')fecha,DISP.NOMBRE dispositivo, EVENT.NOMBRE evento
                FROM ASISTENCIAS ASIS, DISPOSITIVOS DISP, EVENTOS EVENT
                WHERE 
                ASIS.EMPLEADOID = ${id}
                AND EVENT.ID = ASIS.EVENTOID
                AND DISP.ID = ASIS.DISPOSITIVOID
                ORDER BY TIMEST`;

        let registros = await sequelize.query(q2, { type: QueryTypes.SELECT });
        let buffer = await createReport(registros, employee[0]);
        if (!buffer) return res.json({ ok: true, message: 'Sin registros para generar reporte' });

        let { nombres } = employee[0];

        let data = Buffer.from(buffer, "base64"),
            readStream = new stream.PassThrough();

        readStream.end(data);

        res.set('Content-disposition', `attatchment; filename = registro-${nombres}.xlsx`);
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

        readStream.pipe(res, { end: true });
    } catch (err) {
        next(err);
    }

}


// export async function descargarReporteAsistencias(req, res, next) {
//     const { id } = req.params;
//     try {
//         let registros = await sequelize.query(`Select CONCAT(emp.nombres,' ', emp.apellidos) nombres, 
//         emp.ci,
//         CONCAT(asis.latitud,',',asis.longitud) ubicacion,
//         EXTRACT(day FROM asis.hora) dia, 
//         EXTRACT (month FROM asis.hora) mes,
//         EXTRACT (year FROM asis.hora) anio,
//         CONCAT(EXTRACT (HOUR from asis.hora),':',EXTRACT(MINUTE from asis.hora),':',EXTRACT(SECOND from asis.hora))hora,
//         asis.hora timest,
//         disp.nombre dispositivo, 
//         evt.nombre evento
//         FROM asistencias asis
//         INNER JOIN dispositivos disp ON asis.dispositivoid = disp.id
//         INNER JOIN empleados emp ON disp.empleadoid = emp.id
//         INNER JOIN eventos evt ON asis.eventoid = evt.id
//         WHERE emp.id = ${id}
//         ORDER BY timest;
//         `, { type: QueryTypes.SELECT });


//         let bf = await crearExcel(registros);
//         if (!bf) return res.status(500).json({ ok: false, err: { message: `(Sin registros) No se pudo completar la accion...` } });
//         let { nombres } = registros[0];
//         // Bufer del Excel
//         let fileContents = Buffer.from(bf, "base64");

//         // Se crea un flujo de lectura
//         let readStream = new stream.PassThrough();

//         // Se termina de escribir el archivoen el flujo de lectura
//         readStream.end(fileContents);


//         let title = new Date().getMilliseconds() * 369;
//         res.set('Content-disposition', `attatchment; filename = registro-${nombres}.xlsx`);
//         res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

//         // Se crea un pipe hacia la respuesta
//         readStream.pipe(res);

//         readStream.on('error', () => {
//             return res.status(500).json({
//                 ok: false,
//                 message: 'Algo salio mal...'
//             });
//         });

//         readStream.on('finish', () => {
//             console.log('TODO OK!');
//             return
//         });

//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({ ok: false, err });
//     }
// }



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
            if (hInicio !== '00:00:00') {
                hInicio = `${mockDate} ${tiempoGracia}`;
            }

            console.log('hora actual', hActual);
            console.log('hora inicio: ', hInicio);
            console.log('hora fin: ', hFin);
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

function getHoraSalida(periodoLaboral) {
    let horafin = '';

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



            console.log('hora actual', hActual);
            console.log('hora inicio: ', hInicio);
            console.log('hora fin: ', hFin);
            if (hInicio < hActual && hFin > hActual) {
                horafin = periodo.horafin;
                break;
            }
        }
    }
    console.log(horafin);
    return horafin
}