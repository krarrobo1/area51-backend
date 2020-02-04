import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';
import { sequelize } from '../database/database';


// export async function registrarDispositivo(req, res, next) {
//     const { id } = req.data;
//     const { nombre, imei, modelo } = req.body;

//     // Primero verificar IMEI si el dispositivo ya existe...
//     try {
//         let dispositivos = await Dispositivo.findAll({
//             where: {
//                 empleadoid: id
//             },
//             attributes: ['id', 'imei', 'estado']
//         });

//         if (dispositivos.length > 0) {
//             let existente = null;

//             // Set false to know devices
//             dispositivos.forEach(async(dispositivo) => {
//                 if (dispositivo.imei === imei) {
//                     existente = dispositivo;
//                 }
//                 if (dispositivo.estado === true) {
//                     await Dispositivo.update({ estado: false }, { where: { id: dispositivo.id } });
//                 }
//             });
//             if (existente !== null) {
//                 let { id } = existente;

//                 await Dispositivo.update({ nombre, imei, modelo, estado: true }, {
//                     where: { id }
//                 });

//                 let updated = {
//                     id,
//                     nombre,
//                     imei,
//                     modelo,
//                     estado: true
//                 }
//                 return res.json({ ok: true, data: updated });
//             } else {
//                 let nuevoDispositivo = await Dispositivo.create({
//                     empleadoid: id,
//                     nombre,
//                     modelo,
//                     imei
//                 }, {
//                     fields: ['empleadoid', 'nombre', 'modelo', 'imei']
//                 });
//                 return res.json({
//                     ok: true,
//                     data: nuevoDispositivo
//                 });
//             };
//         }
//         // Si es un nuevo dispositivo...
//         dispositivos.forEach(async(dispositivo) => {
//             if (dispositivo.estado === true) {
//                 await Dispositivo.update({ estado: false }, { where: { id: dispositivo.id } });
//             }
//         });
//         let nuevoDispositivo = await Dispositivo.create({
//             empleadoid: id,
//             nombre,
//             modelo,
//             imei
//         }, {
//             fields: ['empleadoid', 'nombre', 'modelo', 'imei']
//         });
//         return res.json({
//             ok: true,
//             data: nuevoDispositivo
//         });
//     } catch (err) {
//         next(err);
//     }
// }

export async function registrarDispositivo(req, res, next) {
    const { id: empleadoid } = req.data;
    const { imei, nombre, modelo } = req.body;
    const data = req.body;
    try {
        let result = await sequelize.transaction(async(t) => {
            // Verifica si el imei ya esta registrado en DB
            let existente = await Dispositivo.findOne({ where: { imei } });
            let estadoTemp = true;
            if (existente) {
                // Verifica si el imei le pertenece al empleado
                if (existente.empleadoid === empleadoid) {
                    await Dispositivo.update(data, { where: { id: existente.id } });
                    return { nombre, modelo, imei, empleadoid, estado: estadoTemp };
                }
                estadoTemp = false;
            }
            // Actualiza el estado del dispositivo anterior a false
            await Dispositivo.update({ estado: false }, { where: { empleadoid: empleadoid, estado: true } });

            // Crea el dispositivo
            let nuevo = await Dispositivo.create({ nombre, modelo, imei, empleadoid, estado: estadoTemp }, { fields: ['nombre', 'modelo', 'imei', 'empleadoid', 'estado'] });
            return nuevo;
        });

        return res.json({ ok: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function obtenerDispositivosPorIdEmpleado(req, res, next) {
    const { id } = req.params;
    try {
        let empleado = await Empleado.findOne({
            where: {
                id
            }
        });
        if (!empleado) return res.status(404).json({ ok: false, err: { message: `EmpleadoNoEncontrado` } });
        const dispositivos = await Dispositivo.findAll({
            where: {
                empleadoid: id
            }
        });
        //if (dispositivos.length == 0) return res.json({ ok: false, data: [] });
        return res.json({
            ok: true,
            data: dispositivos
        });
    } catch (err) {
        next(err);
    }
}

export async function obtenerDispositivo(req, res, next) {
    const { id } = req.params;

    try {
        let dispositivo = await Dispositivo.findOne({
            where: {
                id
            }
        });
        if (!dispositivo) return res.status(404).json({ ok: false, message: 'Dispositivo no encontrado' });
        return res.json({ ok: true, data: dispositivo });
    } catch (err) {
        next(err);
    }
}

export async function modificarDispositivo(req, res, next) {
    const { id } = req.params;
    const { nombre, imei, modelo, estado } = req.body;

    try {
        let dispositivo = await Dispositivo.update({
            nombre,
            imei,
            modelo,
            estado
        }, {
            where: {
                id
            }
        });

        if (dispositivo[0] === 0) return res.status(404).json({ ok: false, message: 'Dispositivo no encontrado' });
        return res.json({ ok: true, message: 'Dispositivo actualizado satisfactoriamente.' });

    } catch (err) {
        next(err);
    }
};

export async function eliminarDispositivo(req, res, next) {
    const { id } = req.params;
    try {
        let dispositivo = await Dispositivo.update({ estado: false }, {
            where: {
                id
            }
        });

        if (dispositivo === 0) return res.status(404).json({ ok: false, message: 'Dispositivo no encontrado' });
        return res.json({ ok: true, message: 'Dispositivo eliminado satisfactoriamente.' });
    } catch (err) {
        next(err);
    }
}