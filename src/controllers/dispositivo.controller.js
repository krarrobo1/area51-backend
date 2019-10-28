import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';

export async function registrarDispositivo(req, res) {
    const { id } = req.data;
    const { nombre, ip, mac, modelo } = req.body;
    try {
        let nuevoDispositivo = await Dispositivo.create({
            empleadoid: id,
            nombre,
            ip,
            mac,
            modelo
        }, {
            fields: ['empleadoid', 'nombre', 'ip', 'mac', 'modelo']
        });

        return res.json({
            ok: true,
            data: nuevoDispositivo
        })
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
        });
    }
}

export async function obtenerDispositivosPorIdEmpleado(req, res) {
    const { id } = req.params;
    try {
        let empleado = await Empleado.findOne({
            where: {
                id
            }
        });
        if (!empleado) return res.status(404).json({ ok: false, err: { message: `No se ha encontrado empleado con id ${id}` } });
        const dispositivos = await Dispositivo.findAll({
            where: {
                empleadoid: id
            }
        });
        if (dispositivos.length == 0) return res.json({ ok: false, data: [] });
        return res.json({
            ok: true,
            data: dispositivos
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function obtenerDispositivo(req, res) {
    const { id } = req.params;

    try {
        let dispositivo = await Dispositivo.findOne({
            where: {
                id
            }
        });
        if (!dispositivo) return res.status(404).json({ ok: false, message: 'Dispositivo no encontrado...' });
        return res.json({ ok: true, data: dispositivo });
    } catch (err) {
        return res.json({ ok: false, err });
    }
}

export async function modificarDispositivo(req, res) {
    const { id } = req.params;
    const { nombre, ip, mac, estado } = req.body;

    try {
        await Dispositivo.update({
            nombre,
            ip,
            mac,
            estado
        }, {
            where: {
                id
            }
        });

        return res.json({ ok: true, message: 'Dispositivo actualizado...' });

    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function eliminarDispositivo(req, res) {
    const { id } = req.params;
    try {
        await Dispositivo.update({ estado: false }, {
            where: {
                id
            }
        });
        return res.json({ ok: true, message: 'Dispositivo eliminado...' });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
}