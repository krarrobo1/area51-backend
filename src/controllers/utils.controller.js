import * as dt from 'date-fns';
import io from '../index';
import redis from '../services/redis-client';
export function getServerDate(req, res) {
    let formated = dt.format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    return res.json({
        serverdate: formated
    });
}
/*
export async function doPing(req, res, next) {
    let { empleadoid } = req.body;
    try {
        if (empleadoid) {
            // Guarda el key en redis por 20 minutos
            await redis.setexAsync(empleadoid, 60 * 20, 'true');
            return res.json({ ok: true, message: 'Pong' });
        } else {
            return res.status(400).json({ ok: false, message: 'empleadoid required!' })
        }
    } catch (err) {
        next(err);
    }
}*/