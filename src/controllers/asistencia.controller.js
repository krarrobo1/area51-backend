import Asistencia from '../models/Asistencia';
import Dispositivo from '../models/Dispositivo';
export async function crearAsistencia(req, res) {
    const { id } = req.data;

    const dispositivos = await Dispositivo.findAll({
        where: {
            empleadoid: id
        }
    });


    const { dataValues } = dispositivos[0];

    // La hora es la hora local del server...
    const { dispositivoid, latitud, longitud, eventoid } = req.body;
    try {
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            hora: new Date,
            latitud,
            longitud,
            eventoid
        }, {
            fields: ['dispositivoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });

        res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        res.status(500).json({ ok: false, err });
    }
};

export async function obtenerAsistencia(req, res) {
    const { id } = req.params;
    try {
        const asistencias = await Asistencia.findAll({
            where: {
                dispositivoid: id
            },
            include: [{ model: Dispositivo }]
        });

        return res.json({ ok: true, data: asistencias });
    } catch (err) {
        res.status(500).json({ ok: true, err });
    }
}