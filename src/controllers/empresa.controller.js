import Empresa from '../models/Empresa';
export async function crearEmpresa(req, res) {
    const { nombre, latitud, longitud } = req.body;
    try {
        let nuevaEmpresa = await
        Empresa.create({
            nombre,
            latitud,
            longitud
        }, {
            fields: ['nombre', 'latitud', 'longitud']
        })
        if (nuevaEmpresa) {
            return res.json({ message: 'Empresa creada correctamente!', data: nuevaEmpresa });
        }
    } catch (err) {
        res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function obtenerEmpresas(req, res) {
    const empresas = await Empresa.findAll();
    if (empresas) {
        return res.json({
            data: empresas
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
        res.status(500).json({
            ok: false,
            err
        });
    }
}


export async function eliminarEmpresa(req, res) {
    const { id } = req.params;

    try {
        await Empresa.destroy({
            where: {
                id
            }
        });

        res.json({
            ok: true,
            message: 'Empresa eliminada...'
        })
    } catch (err) {
        return res.json({
            message: 'Algo salio mal...'
        });
    }
}

export async function actualizarEmpresa(req, res) {
    const { id } = req.params;
    const { nombre, latitud, longitud, estado } = req.body;

    console.log(req.body);

    try {
        await Empresa.update({ nombre, latitud, longitud, estado }, {
            where: {
                id
            }
        });

        return res.json({
            ok: true,
            message: 'Empresa actualizada...'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            err
        });
    }


}