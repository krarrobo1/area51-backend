import JWT from 'jsonwebtoken';
import { seed } from '../config/config';

export async function verificarToken(req, res, next) {
    let token = req.get('Authorization');

    try {
        let decoded = await JWT.verify(token, seed);
        req.data = decoded;
        next();

    } catch (err) {
        return res.status(401).json({
            ok: false,
            message: 'Token invalido...'
        });
    }

}

export function verificarAdmin(req, res, next) {
    let { rol } = req.data;
    if (rol == 'user') return res.status(401).json({ ok: false, message: 'No autorizado...' });
    next();
}

export function verificarSuperAdmin(req, res, next) {
    let { rol } = req.data;
    if (rol !== 'superadmin') return res.status(401).json({ ok: false, message: 'No autorizado...' });
    next();
}