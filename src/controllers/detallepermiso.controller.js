import DetallePermiso from '../models/DetallePermiso';
import Empleado from '../models/Empleado';
import Permiso from '../models/Permiso';
import { runInNewContext } from 'vm';



export async function crearPermiso(req, res) {
    const { id } = req.data
    const { fechainicio, fechafin, permisoid } = req.body;
    try {
        const nuevoPermiso = await DetallePermiso.create({
            empleadoid: id,
            fechainicio,
            fechafin,
            permisoid
        }, {
            fields: ['empleadoid', 'fechainicio', 'fechafin', 'permisoid']
        });

        return res.json({
            ok: true,
            data: nuevoPermiso
        })

    } catch (err) {
        /*const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });*/
        next(err);
    }
}


export async function modificarPermiso(req, res) {
    const { id } = req.params;
    const { fechainicio, fechafin, permisoid, estado } = req.body;
    try {
        let perm = await DetallePermiso.findOne({ where: { id } });
        if (!perm) return res.status(404).json({ ok: false, err: `PermisoNoEncontrado` });
        await DetallePermiso.update({ fechainicio, fechafin, permisoid, estado }, {
            where: {
                id
            }
        });
        return res.json({
            ok: true,
            message: 'Permiso actualizado'
        });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}


export async function eliminarPermiso(req, res) {
    const { id } = req.params;
    try {
        await DetallePermiso.destroy({
            where: {
                id
            }
        });
        return res.json({ ok: true, message: 'Permiso eliminado...' });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

export async function obtenerPermisosPorEmpleadoId(req, res) {
    const { id } = req.params;
    console.log(id);
    try {
        const permisos = await DetallePermiso.findAll({
            where: {
                empleadoid: id
            },
            attributes: ['id', 'fechainicio', 'fechafin', 'estado'],
            include: { model: Permiso, attributes: ['nombre'] }
        });

        if (permisos.length === 0) {
            return res.json({ ok: true, data: [] })
        }
        return res.json({ ok: true, data: permisos });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}


export async function obtenerPermiso(req, res) {
    const { id } = req.params;
    try {
        const permisos = await DetallePermiso.findOne({
            where: {
                id
            },
            attributes: ['id', 'fechainicio', 'fechafin', 'estado'],
            include: [
                { model: Empleado, attributes: ['id', 'ci', 'nombres', 'apellidos'] },
                { model: Permiso, attributes: ['nombre'] }
            ]
        });

        if (!permisos) {
            return res.status(404).json({ ok: false, message: `PermisoNoEncontrado` });
        }
        return res.json({ ok: true, data: permisos });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

// En caso de ser feriado
export async function crearPermisoGeneral(req, res) {
    // permisoid = 3 para feriados..
    const { empresaid, fechainicio, fechafin, permisoid } = req.body;
    try {
        let empleados = await Empleado.findAll({
            where: {
                empresaid
            },
            attributes: ['id']
        });
        if (empleados.length === 0) return res.status(404).json({ ok: false, data: [], message: 'EmpleadoNoEncontrado' });
        let permisos = empleados.map(e => {
            let permiso = {
                empleadoid: e.id,
                fechainicio,
                fechafin,
                permisoid,
                estado: 'aprobado'
            }
            return permiso
        });
        let data = await DetallePermiso.bulkCreate(permisos, { fields: ['empleadoid', 'fechainicio', 'fechafin', 'permisoid', 'estado'] });
        return res.json({ ok: true, data });
    } catch (error) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

export async function obtenerPermisosPorIdEmpresa(req, res) {
    const { empresaid } = req.params;
    try {
        let permisos = await DetallePermiso.findAll({
            attributes: ['id', 'fechainicio', 'fechafin', 'estado'],
            include: [
                { model: Permiso, attributes: ['nombre'] },
                { model: Empleado, where: { empresaid }, attributes: ['id', 'nombres', 'apellidos', 'empresaid'] }
            ]
        });

        //if (permisos.length === 0) return res.json({ ok: false, data: [] });
        return res.json({ ok: true, data: permisos })

    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}