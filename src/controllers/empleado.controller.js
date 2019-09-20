import Empleado from '../models/Empleado';
import bcrypt from 'bcrypt';

export async function crearEmpleado(req, res) {
    const { nombres, apellidos, ci, email, password, empresaid, cargoid } = req.body;
    try {
        const nuevoEmpleado = await Empleado.create({
            nombres,
            apellidos,
            ci,
            email,
            password: await bcrypt.hash(password, 10),
            empresaid,
            cargoid
        }, {
            fields: ['nombres', 'apellidos', 'ci', 'email', 'password', 'empresaid', 'cargoid']
        });
        delete nuevoEmpleado['password'];
        return res.json({
            ok: true,
            data: nuevoEmpleado
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            err
        });
    }
};

export async function obtenerEmpleado(req, res) {
    const { id } = req.params;
    try {
        const empleado = await Empleado.findOne({
            where: {
                id
            }
        });
        if (!empleado) return res.status(404).json({ ok: false, message: 'Usuario no encontrado...' });
        delete empleado['password'];
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