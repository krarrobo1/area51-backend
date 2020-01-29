import Cargo from '../models/Cargo';
export async function crearCargo(req, res, next) {
    const { empresaid, nombre } = req.body;
    try {
        const nuevoCargo = await Cargo.create({
            empresaid,
            nombre
        }, {
            fields: ['empresaid', 'nombre']
        });

        return res.json({ message: 'Cargo creado correctamente', data: nuevoCargo });

    } catch (err) {
        next(err);
    }
}

export async function modificarCargo(req, res, next) {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const cargo = await Cargo.update({ nombre }, {
            where: {
                id
            }
        });

        if (cargo[0] === 0) return res.status(404).json({ ok: false, message: 'Cargo no encontrado' })
        return res.json({ ok: true, message: 'Cargo modificado satisfactoriamente' })
    } catch (err) {
        next(err);
    }
}

export async function obtenerCargo(req, res, next) {
    const { id } = req.params;
    try {
        const cargo = await Cargo.findOne({
            where: {
                id
            }
        });
        if (!cargo) return res.status(404).json({ ok: false, err: { message: `Cargo con id ${id} no encontrado...` } });
        return res.json({ ok: true, data: cargo });
    } catch (err) {
        next(err);
    }
}

export async function eliminarCargo(req, res, next) {
    const { id } = req.params;
    try {
        let deleted = await Cargo.destroy({
            where: {
                id
            }
        });

        if (deleted === 0) return res.status(404).json({ ok: false, message: 'Cargo no encontrado' });
        return res.json({ ok: true, message: 'Cargo eliminado satisfactoriamente' });
    } catch (err) {
        next(err);
    }
}

export async function obtenerCargosPorEmpresaId(req, res, next) {
    const { empresaid } = req.params;
    try {
        const cargos = await Cargo.findAll({
            where: {
                empresaid
            }
        });
        return res.json({ ok: true, data: cargos });
    } catch (err) {
        next(err);
    }
}