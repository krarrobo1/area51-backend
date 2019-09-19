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

// TODO: Remove password from res.

export async function obtenerEmpleado(req, res) {
    const { id } = req.params;
    try {
        const empleado = await Empleado.findOne({
            where: {
                id
            }
        });
        if (!empleado) return res.status(404).json({ ok: false, message: 'Usuario no encontrado...' });
        return res.json({ ok: true, data: empleado });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            err
        });
    }
}

async function crypt(data) {
    try {
        const encrypted = await bcrypt.hash(data, 10);
        console.log(encrypted);
        return encrypted;
    } catch (err) {
        console.log(err);
    }

}