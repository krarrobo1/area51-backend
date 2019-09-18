import Cargo from '../models/Cargo';
export async function crearCargo(req, res) {
    const { empresaid, nombre } = req.body;
    try {
        const nuevoCargo = await Cargo.create({
            empresaid,
            nombre
        }, {
            fields: ['empresaid', 'nombre']
        });

        if (nuevoCargo) {
            res.json({
                message: 'Cargo creado correctamente',
                data: nuevoCargo
            });
        }
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function modificarCargo(req, res) {
    const { id } = req.params;
    const { nombre } = req.body;
    try {
        const cargo = await Cargo.update({ nombre }, {
            where: {
                id
            }
        });
        return res.json({
            ok: true,
            message: 'Cargo modificado'
        })
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function eliminarCargo(req, res) {
    const { id } = req.params;
    try {
        await Cargo.destroy({
            where: {
                id
            }
        });

        res.json({
            ok: true,
            message: 'Cargo eliminado...'
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function obtenerCargosPorEmpresaId(req, res) {
    const { empresaid } = req.params;
    try {
        const cargos = await Cargo.findAll({
            where: {
                empresaid
            }
        });
        res.json({
            ok: true,
            data: cargos
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
}