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
import { subDateTime, addTime } from '../services/timecalculator';


import { createReport } from '../services/excelgenerator';
import * as dt from 'date-fns';
import { es } from 'date-fns/locale';
import { sequelize } from '../database/database';
import { QueryTypes } from 'sequelize';





export async function registrarAsistencia(req, res, next) {
    const { id: empleadoid } = req.data;
    try {
        const { dispositivoid, latitud, longitud } = req.body;
        // Busca su equipo
        const equipo = await Dispositivo.findOne({
            where: {
                id: dispositivoid,
                empleadoid
            }
        });

        // Comprueba su equipo
        if (!equipo) return res.status(404).json({ ok: false, message: 'Equipo no encontrado' });
        let { estado } = equipo;

        // Comprueba el estado del equipo
        if (!estado) return res.status(400).json({ ok: false, message: 'Equipo no activo para registrar asistencias', code: 1 });
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { id: empleadoid },
            include: [{ model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }]
        });

        let periodoLaboral = empleado.cargo.periodos;

        // Comprueba que tenga un periodo Laboral
        if (periodoLaboral.length === 0) return res.status(404).json({ ok: false, message: 'El cargo no tiene periodos laborales' });

        // Comprueba que este dentro de su periodo laboral
        let periodoActual = comprobarPeriodoLaboral(periodoLaboral);

        let { enhorario, horafin, horainicio } = periodoActual;



        if (!enhorario) return res.status(400).json({ ok: false, message: 'El empleado se encuentra fuera de horario laboral', code: 2 });
        let event = await obtenerUltimoEvento(empleadoid);
        // let tiempo = await obtenerTiempoLaborado(empleadoid);
        // let event = 1;
        // let { data } = tiempo;
        // data.evento === 'Entrada' ? event = 2 : event = 1;

        // if (event === 1) await redis.setexAsync(empleadoid, 60 * 20, 'true'); // Guarda el key en redis por 20 minutos




        // Guarda una Salida pendiente.
        // await crearSalidaPendiente(event, {
        //     horafin,
        //     latitud,
        //     longitud,
        //     dispositivoid,
        //     empleadoid
        // });

        // Crea una asistencia
        const asistencia = await crearAsistencia({ empleadoid, dispositivoid, latitud, longitud, eventoid: event });

        asistencia.dataValues.horainicio = horainicio;
        asistencia.dataValues.horafin = horafin;
        // asistencia.dataValues.tiempoLaborado = data.tiempoLaborado;

        return res.json({ ok: true, data: asistencia });
    } catch (err) {
        next(err);
    }
};


export async function registrarAsistenciaWeb(req, res, next) {
    try {

        const { ci, dispositivoid } = req.body;

        // Busca un empleado por su cedula.
        const empleado = await Empleado.findOne({
            attributes: ['id'],
            where: { ci },
            include: [{ model: Empresa, attributes: ['latitud', 'longitud'] }, { model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }]
        });

        if (!empleado) return res.status(404).json({ ok: false, message: 'EmpleadoNoEncontrado' });
        let { latitud, longitud } = empleado.empresa;
        let periodoLaboral = empleado.cargo.periodos;
        // Comprueba que tenga un periodo Laboral
        if (periodoLaboral.length === 0) return res.status(404).json({ ok: false, err: { message: 'SinPeriodosLaborales' } });

        // Comprueba que este dentro del periodo Laboral
        let periodoActual = comprobarPeriodoLaboral(periodoLaboral);
        let { enhorario, horafin } = periodoActual;


        if (!enhorario) return res.status(400).json({ ok: false, err: { message: 'FueraDeHorario' } })





        let event = await obtenerUltimoEvento(empleado.id);


        console.log(event);

        // Guarda una Salida pendiente.
        await crearSalidaPendiente(event, {
            horafin,
            latitud,
            longitud,
            dispositivoid,
            empleadoid: empleado.id
        });


        // Registra una asistencia
        const nuevaAsistencia = await crearAsistencia({
            dispositivoid,
            empleadoid: empleado.id,
            latitud: empleado.empresa.latitud,
            longitud: empleado.empresa.longitud,
            eventoid: event
        });


        // Devuelve el nombre del evento al Front...
        let evento = (event === 1) ?
            'Entrada' : 'Salida';

        delete nuevaAsistencia.dataValues.eventoid;
        nuevaAsistencia.dataValues.evento = evento;

        return res.json({ ok: true, data: nuevaAsistencia });
    } catch (err) {
        next(err);
    }
}

export async function sincronizarAsistencia(req, res, next) {
    const { id } = req.data;
    let event = await obtenerUltimoEvento(id);
    console.log(event);
    try {
        let { dispositivoid, latitud, longitud, hora } = req.body;
        const asistencia = await Asistencia.create({
            dispositivoid,
            empleadoid: id,
            hora,
            latitud,
            longitud,
            eventoid: event
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });
        return res.json({ data: asistencia })
    } catch (error) {
        next(error);
    };
}



export async function obtenerAsistencias(req, res, next) {
    const { id } = req.data;
    const { date } = req.query;
    console.log({ id, date });

    const QUERY = `SELECT ASIS.LATITUD, ASIS.LONGITUD, TO_CHAR(ASIS.HORA, 'dd/mm/yyyy HH24:MI:SS') formatedDate, asis.hora timest,DISP.NOMBRE dispositivo, EVENT.NOMBRE evento
    FROM ASISTENCIAS ASIS, DISPOSITIVOS DISP, EVENTOS EVENT
    WHERE 
    ASIS.EMPLEADOID = ${id}
    AND TO_CHAR(ASIS.hora, 'dd/mm/yyyy') = '${date}'
    AND EVENT.ID = ASIS.EVENTOID
    AND DISP.ID = ASIS.DISPOSITIVOID
    ORDER BY timest
    `;
    try {
        let data = await sequelize.query(QUERY, { type: QueryTypes.SELECT });
        return res.json({ ok: true, data });
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

export async function obtenerAsistenciasPorFecha(req, res, next) {
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

export async function obtenerTiempoAsistencia(req, res, next) {
    const { id } = req.data;
    try {
        let tiempoLaborado = await obtenerTiempoLaborado(id);
        return res.json(tiempoLaborado);
    } catch (err) {
        next(err);
    }
}

// TODO: Chequear caso Doble Entrada | Salida.
async function obtenerTiempoLaborado(id) {
    let entradas = [],
        salidas = [],
        total = null;
    let hoy = dt.format(Date.now(), 'dd/MM/yyyy');

    const QUERY = `SELECT TO_CHAR(ASIS.HORA, 'dd/mm/yyyy HH24:MI:SS') hora, asis.hora fecha,EVENT.NOMBRE evento
    FROM ASISTENCIAS ASIS, EVENTOS EVENT
    WHERE 
    ASIS.EMPLEADOID = ${id}
    AND TO_CHAR(ASIS.hora, 'dd/mm/yyyy') = '${hoy}'
    AND EVENT.ID = ASIS.EVENTOID
    ORDER BY fecha
    `;
    try {
        let asistencias = await sequelize.query(QUERY, { type: QueryTypes.SELECT });
    
        
        if (asistencias.length === 0) return { message: 'SinRegistros', data: { tiempoLaborado: "00:00:00" } };

        let ultimaAsistencia = asistencias[asistencias.length - 1];

        // Si el primer registro es una salida no se toma en cuenta en el conteo.
        if (asistencias[0].evento === 'Salida') asistencias.shift();

        // Agrupamos entradas y salidas
        // asistencias.forEach(asistencia => { asistencia.evento === 'Entrada' ? entradas.push(asistencia) : salidas.push(asistencia) });

        // Si el ultimo registro es una entrada lo sustraemos con la hora actual.
        if (ultimaAsistencia.evento === 'Entrada') {
            asistencias.push({evento: 'Salida', fecha: new Date});
            // salidas.push({ hora: `${hoy} ${tiempoActual.toTimeString().split(' ')[0]}` });
        }
        let temp = null;
        for (let i = 0; i < asistencias.length; i++) {
            //console.log({asis:asistencias[i]});
            let {evento, fecha} = asistencias[i];
            if(temp === null) temp = {evento, fecha};
            else{      
                let sum = subDateTime(temp.fecha,fecha);
                total === null ? total = sum : total = addTime(sum, total);
                temp = null;
            } 
        }
        //console.log({total});
        
        // if (entradas.length === salidas.length) {
        //     for (let i = 0; i < entradas.length; i++) {
        //         const etemp = entradas[i];
        //         const stemp = salidas[i];

        //         let { hora: ehour } = etemp;
        //         let { hora: shour } = stemp;

        //         let temp = subDateTime(new Date(ehour), new Date(shour));

        //         total === null ? total = temp : total = addTime(temp, total);
        //         // console.log({ ehour, shour, total });
        //     }
        // }
        return { data: { tiempoLaborado: total, evento: ultimaAsistencia.evento } }
    } catch (err) {
        throw err;
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

        if (employee.length === 0) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

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




function comprobarPeriodoLaboral(periodoLaboral) {

    let response = { enhorario: false, horafin: '' };
    let mockDate = '01/01/2019';
    let now = dt.format(Date.now(), 'EEEE HH:mm:ss', { locale: es }).split(' ');

    let nombreDia = now[0].charAt(0).toUpperCase() + now[0].slice(1);
    let horaActual = now[1];

    for (let i = 0; i < periodoLaboral.length; i++) {
        const periodo = periodoLaboral[i];
        let { dia } = periodo;
        if (dia.nombre === nombreDia) {
            let hActual = `${mockDate} ${horaActual}`;
            let hInicio = `${mockDate} ${periodo.horainicio}`;
            let hFin = `${mockDate} ${periodo.horafin}`;

            // 10 minutos antes de que comience la jornada
            let tgEntrada = dt.subMinutes(new Date(hInicio), 10).toTimeString().split(' ')[0];

            // 10 minutos despues de que acabe
            let tgSalida = dt.addMinutes(new Date(hFin), 10).toTimeString().split(' ')[0];


            let hgInicio = `${mockDate} ${tgEntrada}`;

            //let hgFin = `${mockDate} ${tgSalida};`

            if (hgInicio < hActual && hFin > hActual) {
                // Si entra 10 min antes de la hora de Inicio se marca a tiempo
                response.enhorario = true;
                response.horafin = `${periodo.horafin}`;
                response.horainicio = `${periodo.horainicio}`;
                break;
            }
        }
    }
    // console.log('Estado periodoLaboral: ', {
    //     dia: nombreDia,
    //     enHorario: response.enhorario
    // });
    return response;
}



async function crearAsistencia(objTemp) {
    let { empleadoid, dispositivoid, latitud, longitud, eventoid } = objTemp;
    const asistencia = await Asistencia.create({
        dispositivoid,
        empleadoid,
        hora: new Date,
        latitud,
        longitud,
        eventoid
    }, {
        fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
    });

    return asistencia;
}

// Este metodo sirve para almacenar en BD una salida pendiente, 
// el servidor revisa los registros temporales de esta tabla para buscar salidas pendientes 
// y cerrarlas en su hora de finalizacion de jornada.

async function crearSalidaPendiente(event, obj) {
    let {
        horafin,
        latitud,
        longitud,
        dispositivoid,
        empleadoid
    } = obj;

    if (event === 1) {
        let temp = await Temp.create({
            horafin,
            latitud,
            longitud,
            dispositivoid,
            empleadoid
        }, {
            fields: ['dispositivoid', 'empleadoid', 'horafin', 'latitud', 'longitud']
        });
        console.log("Salida pendiente", JSON.stringify(temp));
    } else {
        await Temp.destroy({
            where: {
                empleadoid
            }
        });
        console.log('Salida pendiente eliminada');
    }
}

export async function obtenerUltimoEvento(empleadoid) {
    let ultimoRegistro = await sequelize.query(`SELECT eventoid FROM ASISTENCIAS 
    WHERE EMPLEADOID = ${empleadoid}
    order by hora desc 
    limit 1;`, { type: QueryTypes.SELECT });



    let event = 1;
    if (ultimoRegistro.length !== 0) {
        let { eventoid } = ultimoRegistro[0];
        if (eventoid === 1) event = 2;
    }

    return event;
}