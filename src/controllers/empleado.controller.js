import Empleado from '../models/Empleado';
import bcrypt from 'bcrypt';

export async function crearEmpleado(req, res) {
    const { nombres, apellidos, ci, email, password, empresaid, cargoid, rolid } = req.body;
    try {
        let nuevoEmpleado = await Empleado.create({
            nombres,
            apellidos,
            ci,
            email,
            password: await bcrypt.hash(password, 10),
            empresaid,
            cargoid,
            rolid
        }, {
            fields: ['nombres', 'apellidos', 'ci', 'email', 'password', 'empresaid', 'cargoid', 'rolid']
        });
        delete nuevoEmpleado.dataValues.password;
        return res.json({
            ok: true,
            data: nuevoEmpleado
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function obtenerEmpleado(req, res) {
    const { id } = req.params;
    try {
        let empleado = await Empleado.findOne({
            where: {
                id
            },
            attributes: ['nombres', 'apellidos', 'email', 'rolid', 'cargoid', 'empresaid']
        });
        if (!empleado) return res.status(404).json({ ok: false, message: 'Usuario no encontrado...' });
        delete empleado.dataValues.password;
        return res.json({ ok: true, data: empleado });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function modificarEmpleado(req, res) {
    const { nombres, apellidos, ci, email } = req.body;
    const { id } = req.params;
    try {
        await Empleado.update({ nombres, apellidos, ci, email }, {
            where: {
                id
            }
        }, {
            fields: ['nombres', 'apellidos', 'ci', 'email']
        });
        return res.json({
            ok: true,
            message: 'Usuario actualizado...'
        });
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
}

export async function eliminarEmpleado(req, res) {
    const { id } = req.params;
    try {
        await Empleado.destroy({
            where: {
                id
            }
        });
        return res.json({
            ok: true,
            message: 'Empleado eliminado correctamente'
        })
    } catch (err) {
        return res.status(500).json({
            ok: false,
            err
        });
    }
}