import Asistencia from '../models/Asistencia';

export async function crearAsistencia(req, res) {

    // La hora es la hora local del server...
    const { dispositivoid, empleadoid, latitud, longitud, eventoid } = req.body;
    try {
        const nuevaAsistencia = await Asistencia.create({
            dispositivoid,
            empleadoid,
            hora: new Date,
            latitud,
            longitud,
            eventoid
        }, {
            fields: ['dispositivoid', 'empleadoid', 'hora', 'latitud', 'longitud', 'eventoid']
        });

        res.json({ ok: true, asistencia: nuevaAsistencia });
    } catch (err) {
        res.status(500).json({ ok: false, err });
    }
};