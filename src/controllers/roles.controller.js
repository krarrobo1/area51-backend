import Rol from '../models/Rol';

export async function obtenerRol(req, res) {
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
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }

}


export async function obtenerRoles(req, res) {
    try {
        const data = await Rol.findAll();
        if (data.length == 0) return res.status(404).json({ ok: false, err: { message: 'No se encontraron roles..' } });
        return res.json({ ok: true, data });
    } catch (err) {

    }

}