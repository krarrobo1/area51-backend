import DetallePermiso from '../models/DetallePermiso';

export async function crearPermiso(req, res) {
    const { empleadoid, fechainicio, fechafin, permisoid } = req.body;
    try {
        const nuevoPermiso = await DetallePermiso.create({
            empleadoid,
            fechainicio,
            fechafin,
            permisoid
        }, {
            fields: ['empleadoid', 'fechainicio', 'fechafin', 'permisoid']
        });

        res.json({
            ok: true,
            data: nuevoPermiso
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }
}


export async function modificarPermiso(req, res) {
    const { id } = req.params;
    const { fechainicio, fechafin, permisoid, estado } = req.body;
    try {
        await DetallePermiso.update({ fechainicio, fechafin, permisoid, estado }, {
            where: {
                id
            }
        });
        return res.json({
            ok: true,
            message: 'Permiso actualizado...'
        });
    } catch (err) {
        return res.json({
            ok: false,
            err
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
        return res.json({
            ok: false,
            err
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
            }
        });

        if (!permisos) {
            return res.status(404).json({ ok: false, message: 'No se han encontrado permisos' });
        }
        return res.json({ ok: true, data: permisos });
    } catch (err) {
        return res.json({
            ok: false,
            err
        });
    }
}


export async function obtenerPermiso(req, res) {
    const { id } = req.params;
    try {
        const permisos = await DetallePermiso.findAll({
            where: {
                id
            }
        });

        if (!permisos) {
            return res.status(404).json({ ok: false, message: 'No se han encontrado permisos' });
        }
        return res.json({ ok: true, data: permisos });
    } catch (err) {
        return res.json({
            ok: false,
            err
        });
    }
}