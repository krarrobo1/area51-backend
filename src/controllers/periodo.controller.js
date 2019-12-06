import Periodo from '../models/Periodo';

export async function crearPeriodo(req, res, next) {
    const { cargoid, diaid, horainicio, horafin } = req.body;
    try {
        let nuevo = await Periodo.create({
            cargoid,
            diaid,
            horainicio,
            horafin
        }, {
            fields: ['cargoid', 'diaid', 'horainicio', 'horafin']
        });
        if (nuevo) return res.json({ ok: true, data: nuevo });
    } catch (err) {
        next(err);
    }
};

/*Debe retornar el dia laboral, la hora inicio y la hora fin */

export async function obtenerPeriodoPorIdCargo(req, res, next) {
    const { id } = req.params;
    try {
        const periodos = await Periodo.findAll({
            where: {
                cargoid: id
            }
        });
        return res.json({
            ok: true,
            data: periodos
        });

    } catch (err) {
        next(err);
    }
};


export async function modificarPeriodo(req, res, next) {
    const { id } = req.params;
    const { horainicio, horafin, diaid } = req.body;
    try {
        const periodo = await Periodo.update({ horainicio, horafin, diaid }, {
            where: {
                id
            }
        });

        return res.json({
            ok: true,
            message: 'Periodo modificado correctamente'
        })
    } catch (err) {
        next(err);
    }
};

export async function eliminarPeriodo(req, res, next) {
    const { id } = req.params;
    try {
        await Periodo.destroy({
            where: {
                id
            }
        });

        return res.json({
            ok: true,
            message: 'Periodo eliminado'
        })
    } catch (err) {
        next(err);
    }
};

export async function obtenerPeriodo(req, res, next) {
    const { id } = req.params;
    try {
        let periodo = await Periodo.findOne({
            where: {
                id
            }
        });

        if (!periodo) {
            res.status(404).json({
                ok: false,
                message: 'Periodo no encontrado'
            });
        }
        return res.json({
            ok: true,
            data: periodo
        });
    } catch (err) {
        next(err);
    }
};