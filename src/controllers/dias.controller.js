import Dia from '../models/Dia';

export async function obtenerCatalogoDias(req, res) {
    try {
        let data = await Dia.findAll();
        return res.json({ ok: true, data });
    } catch (err) {
        return res.status(500).json({ ok: false, err });
    }
}