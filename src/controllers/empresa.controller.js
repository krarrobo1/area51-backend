import Empresa from '../models/Empresa';
import { getAddress } from '../services/geo';

export async function crearEmpresa(req, res) {
    const { nombre, latitud, longitud, radio } = req.body;
    try {
        const direccion = await getAddress(latitud, longitud);
        let nuevaEmpresa = await Empresa.create({
            nombre,
            latitud,
            longitud,
            radio,
            direccion
        }, {
            fields: ['nombre', 'latitud', 'longitud', 'radio', 'direccion']
        });
        if (nuevaEmpresa) return res.json({ ok: true, message: 'Empresa creada correctamente!', data: nuevaEmpresa });

    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
};

export async function obtenerEmpresas(req, res) {

    try {
        const empresas = await Empresa.findAll();
        if (empresas) {
            return res.json({
                ok: true,
                data: empresas
            });
        }
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

export async function obtenerEmpresa(req, res) {
    const { id } = req.params;
    try {
        const empresa = await Empresa.findOne({
            where: {
                id
            }
        });
        if (!empresa) {
            return res.status(404).json({
                message: 'Empresa no encontrada...'
            })
        }

        return res.json({
            ok: true,
            data: empresa
        });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}


export async function eliminarEmpresa(req, res) {
    const { id } = req.params;
    try {
        let empresa = await Empresa.destroy({
            where: {
                id
            }
        });
        if (empresa == 0) return res.status(404).json({ ok: false, err: { message: `Empresa con ID: ${id} no encontrada...` } })
        return res.json({
            ok: true,
            message: 'Empresa eliminada...'
        })

        //let empresa = await Empresa.update({})
    } catch (err) {
        console.log('Error:', err);
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }
}

export async function actualizarEmpresa(req, res) {
    const { id } = req.params;
    const { nombre, latitud, longitud, radio, estado } = req.body;

    try {
        let direccion;
        if (latitud !== undefined && longitud !== undefined) {
            direccion = await getAddress(latitud, longitud);
        }
        console.log(direccion);
        await Empresa.update({ nombre, latitud, longitud, radio, estado, direccion }, {
            where: {
                id
            }
        });

        return res.json({
            ok: true,
            message: 'Empresa actualizada...'
        });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message: message }
        });
    }


}