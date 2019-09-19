import Periodo from '../models/Periodo';

export async function crearPeriodo(req, res) {
    const { cargoid, diaid, horainicio, horafin } = req.body;
    console.log(req.body);

    try {
        let nuevo = await Periodo.create({
            cargoid,
            diaid,
            horainicio,
            horafin
        }, {
            fields: ['cargoid', 'diaid', 'horainicio', 'horafin']
        });
        if (nuevo) return res.json({ ok: true, message: 'Periodo creado correctamente...', data: nuevo });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
};

/*Debe retornar el dia laboral, la hora inicio y la hora fin */

export async function obtenerPeriodoPorIdCargo(req, res) {
    const { id } = req.params;
    console.log(id);
    try {
        const periodos = await Periodo.findAll({
            where: {
                cargoid: id
            }
        });
        return res.json({
            ok: true,
            periodos
        });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
};


export async function modificarPeriodo(req, res) {
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
        res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function eliminarPeriodo(req, res) {
    const { id } = req.params;
    try {
        await Periodo.destroy({
            where: {
                id
            }
        });

        return res.json({
            ok: true,
            message: 'Periodo eliminado exitosamente...'
        })
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function obtenerPeriodo(req, res) {
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
                message: 'Periodo no encontrado...'
            });
        }
        res.json({
            ok: true,
            periodo
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
};

/*export async function foo(req, res) {
    try {

    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
};*/