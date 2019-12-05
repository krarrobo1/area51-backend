import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Cargo from '../models/Cargo';
import Rol from '../models/Rol';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
import { sendEmail } from '../services/smtp';

export async function crearEmpleado(req, res, next) {
    const { nombres, apellidos, ci, email, empresaid, cargoid, rolid } = req.body;
    try {
        // Secret Key
        let passresetkey = shortid.generate();

        let nuevoEmpleado = await Empleado.create({
            nombres,
            apellidos,
            ci,
            passresetkey,
            email,
            empresaid,
            cargoid,
            rolid
        }, {
            fields: ['nombres', 'apellidos', 'ci', 'passresetkey', 'email', 'empresaid', 'cargoid', 'rolid']
        });

        delete nuevoEmpleado.dataValues.passresetkey;
        delete nuevoEmpleado.dataValues.password;

        let message = {
            to: email,
            subject: `Registrate App | Confirmación de cuenta`,
            text: `
            Hola ${nombres}, Bienvenido a Registrate App
            Ingresa al siguiente link: https://registrate-1570332821411.web.app/login/configurar-contraseña?key=${passresetkey} 
            para confirmar tu cuenta y establecer tu constraseña`
        }

        await sendEmail(message, res);
        console.log(`Email sended ${email}...`);

        return res.json({
            ok: true,
            data: nuevoEmpleado
        });

    } catch (err) {
        next(err);
    }
};

export async function forgotPassword(req, res, next) {
    let { email } = req.body;
    try {
        let empleadoDB = await Empleado.findOne({
            where: {
                email
            },
            attributes: ['id']
        });
        if (!empleadoDB) return res.status(404).json({ ok: false, err: { message: 'EmpleadoNoEncontrado' } });
        let passresetkey = shortid.generate();


        let emp = await Empleado.update({ passresetkey }, {
            where: {
                id: empleadoDB.id
            }
        });

        console.log('state', emp);

        let message = {
            to: email,
            subject: `Registrate App | Reestablece tu contraseña`,
            text: `Has solicitado un cambio de constraseña, si realmente lo hiciste, ingresa al siguiente link: 
            https://registrate-1570332821411.web.app/login/configurar-contraseña?key=${passresetkey} 
            para escoger una nueva constraseña.

            Si no quieres cambiar tu contraseña ignora este email y tu contraseña no cambiará.`
        }
        await sendEmail(message, res);
        return res.json({ ok: true, message: `Email sended ${email}...` });
    } catch (err) {
        next(err);
    }
}

export async function setPassword(req, res, next) {
    let { password, key } = req.body;
    try {
        let empleadoDB = await Empleado.findOne({
            where: {
                passresetkey: key
            },
            attributes: ['id', 'passresetkey']
        });
        if (!empleadoDB) return res.status(404).json({ ok: false, err: { message: `EmpleadoNoEncontrado` } });
        let { id, passresetkey } = empleadoDB;

        let encrypted = await bcrypt.hash(password, 10);
        let updated = await Empleado.update({ password: encrypted }, {
            where: {
                id
            }
        });
        console.log(updated);
        return res.json({ ok: true, message: 'Password reestablecido' });

    } catch (err) {
        next(err);
    }
}




export async function obtenerEmpleadosPorEmpresa(req, res, next) {
    const { id } = req.params;
    try {
        let empresa = await Empresa.findOne({
            where: {
                id
            }
        });
        if (!empresa) return res.status(404).json({ ok: false, message: 'EmpresaNoEncontrada' });
        let empleados = await Empleado.findAll({
            where: { empresaid: id },
            attributes: ['id', 'nombres', 'apellidos', 'email', 'ci'],
            include: [
                { model: Cargo, attributes: ['id', 'nombre'] },
                { model: Empresa },
                { model: Rol }
            ]
        });
        if (empleados.length === 0) return res.status.json({ ok: false, data: [] });
        return res.json({ ok: true, data: empleados });
    } catch (err) {
        next(err);
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

export async function modificarEmpleado(req, res, next) {
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
        next(err);
    }
}

export async function eliminarEmpleado(req, res, next) {
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
        next(err);
    }
}