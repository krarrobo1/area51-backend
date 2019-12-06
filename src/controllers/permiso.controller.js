import Permiso from '../models/Permiso';

export async function obtenerCatalogoPermiso(req, res, next) {
    try {
        let data = await Permiso.findAll({});
        if (data.length === 0) return res.status(404).json({ ok: false, err: { message: `Permisos not found` } });
        return res.json({ ok: true, data });
    } catch (err) {
        next(err);
    }
}