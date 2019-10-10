import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Cargo from '../models/Cargo';
import Rol from '../models/Rol';
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
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
        });
    }
};

export async function obtenerEmpleadosPorEmpresa(req, res) {
    const { id } = req.params;
    console.log(id);
    try {
        let empresa = await Empresa.findOne({
            where: {
                id
            }
        });
        if (!empresa) return res.status(404).json({ ok: false, message: 'No se encontro empresa con ese ID' });
        let empleados = await Empleado.findAll({
            where: { empresaid: id },
            attributes: ['id', 'nombres', 'apellidos', 'email', 'ci'],
            include: [
                { model: Cargo, attributes: ['id', 'nombre'] },
                { model: Empresa },
                { model: Rol }
            ]
        });

        if (!empleados) return res.status(404).json({ ok: false, message: 'No se encontraron empleados de esa empresa' });
        return res.json({ ok: true, data: empleados });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
        });
    }
}

export async function obtenerEmpleado(req, res) {
    const { id } = req.params;
    try {
        let empleado = await Empleado.findOne({
            where: {
                id
            },
            attributes: ['id', 'ci', 'nombres', 'apellidos', 'email'],
            include: [
                { model: Cargo, attributes: ['id', 'nombre'] },
                { model: Empresa },
                { model: Rol }
            ]
        });
        if (!empleado) return res.status(404).json({ ok: false, message: 'Usuario no encontrado...' });
        delete empleado.dataValues.password;
        return res.json({ ok: true, data: empleado });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
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
            message: 'Empleado actualizado...'
        });
    } catch (err) {
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
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
        const message = err.errors[0].message;
        return res.status(500).json({
            ok: false,
            err: { message }
        });
    }
}