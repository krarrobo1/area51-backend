import Dispositivo from '../models/Dispositivo';
import Empleado from '../models/Empleado';

export async function registrarDispositivo(req, res, next) {
    const { id } = req.data;
    const { nombre, imei, modelo } = req.body;

    // Primero verificar IMEI si el dispositivo ya existe...
    try {
        let dispositivos = await Dispositivo.findAll({
            where: {
                empleadoid: id
            },
            attributes: ['id', 'imei']
        });

        if (dispositivos.length > 0) {
            // Set false to know devices
            dispositivos.forEach(dispositivo => {
                Dispositivo.update({ estado: false }, { where: { id: dispositivo.id } });
            });

            let existente = dispositivos.filter((d) => d.imei === imei);
            if (existente.length > 0) {
                let { id } = existente[0];
                await Dispositivo.update({ nombre, imei, modelo, estado: true }, {
                    where: { id }
                });

                return res.json({
                    ok: true, data: {
                        id,
                        nombre,
                        imei,
                        modelo,
                        estado
                    }
                });
            } else {
                let nuevoDispositivo = await Dispositivo.create({
                    empleadoid: id,
                    nombre,
                    modelo,
                    imei
                }, {
                        fields: ['empleadoid', 'nombre', 'modelo', 'imei']
                    });
                return res.json({
                    ok: true,
                    data: nuevoDispositivo
                });
            };
        }
        let nuevoDispositivo = await Dispositivo.create({
            empleadoid: id,
            nombre,
            modelo,
            imei
        }, {
                fields: ['empleadoid', 'nombre', 'modelo', 'imei']
            });
        return res.json({
            ok: true,
            data: nuevoDispositivo
        });
    } catch (err) {
        next(err);
    }
}

export async function obtenerDispositivosPorIdEmpleado(req, res, next) {
    const { id } = req.params;
    try {
        let empleado = await Empleado.findOne({
            where: {
                id
            }
        });
        if (!empleado) return res.status(404).json({ ok: false, err: { message: `EmpleadoNoEncontrado` } });
        const dispositivos = await Dispositivo.findAll({
            where: {
                empleadoid: id
            }
        });
        //if (dispositivos.length == 0) return res.json({ ok: false, data: [] });
        return res.json({
            ok: true,
            data: dispositivos
        });
    } catch (err) {
        next(err);
    }
}

export async function obtenerDispositivo(req, res, next) {
    const { id } = req.params;

    try {
        let dispositivo = await Dispositivo.findOne({
            where: {
                id
            }
        });
        if (!dispositivo) return res.status(404).json({ ok: false, message: 'DispositivoNoEncontrado' });
        return res.json({ ok: true, data: dispositivo });
    } catch (err) {
        next(err);
    }
}

export async function modificarDispositivo(req, res, next) {
    const { id } = req.params;
    const { nombre, imei, modelo, estado } = req.body;

    try {
        let dispositivo = await Dispositivo.update({
            nombre,
            imei,
            modelo,
            estado
        }, {
                where: {
                    id
                }
            });

        console.log(dispositivo);
        return res.json({ ok: true, message: 'Dispositivo actualizado...' });

    } catch (err) {
        next(err);
    }
};

export async function eliminarDispositivo(req, res, next) {
    const { id } = req.params;
    try {
        let dispositivo = await Dispositivo.update({ estado: false }, {
            where: {
                id
            }
        });
        return res.json({ ok: true, message: 'Dispositivo eliminado...' });
    } catch (err) {
        next(err);
    }
}