import Rol from '../models/Rol';

export async function obtenerRol(req, res, next) {
    const { id } = req.params;
    try {
        const data = await Rol.findOne({
            where: {
                id
            }
        });
        if (!data) return res.status(404).json({ ok: false, err: { message: `rol con id ${id} no encontrado...` } });
        return res.json({ ok: true, data });
    } catch (err) {
        next(err);
    }

}


export async function obtenerRoles(req, res, next) {
    try {
        const data = await Rol.findAll();
        if (data.length == 0) return res.status(404).json({ ok: false, err: { message: 'No se encontraron roles..' } });
        return res.json({ ok: true, data });
    } catch (err) {
        next(err);
    }

}