import Empleado from '../models/Empleado';
import Dispositivo from '../models/Dispositivo';
import Empresa from '../models/Empresa';
import Cargo from '../models/Cargo';
import Rol from '../models/Rol';
import bcrypt from 'bcrypt';
import shortid from 'shortid';
import { sendEmail } from '../libs/smtp';

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
            html: `
            <div style="background-color: #f6f6f6ff; padding: 12px;font-family:font-family: Arial, Helvetica, sans-serif">
            <h2 style="text-align: center;">Bienvenido a Registrate App</h2>
             <!--<img src=""></img> -->
            <p style="text-align: justify;">Hola <strong>${nombres}</strong> te damos la bienvenida a Registrate App. Ingresa al siguiente <a href="https://registrateapp.com.ec/login/configurar?key=${passresetkey} ">enlace </a> para configurar tu cuenta.</p>
            Para más información visita: <a href="Grupo Aptec">https://registrateapp.com.ec/assets/Manual_de_Usuario.pdf</a> <br /> <br />
            </div>`
        }

        await sendEmail(message, res);
        console.log(`Email enviado a: ${email}`);

        if (rolid <= 2) {
            let nuevoDispositivo = await Dispositivo.create({
                empleadoid: nuevoEmpleado.id,
                nombre: 'Web',
                modelo: 'Navegador',
                imei: 'n/a',
                isweb: true,
                estado: true
            }, {
                fields: ['empleadoid', 'nombre', 'modelo', 'imei', 'isweb', 'estado']
            });
        }

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
        if (!empleadoDB) return res.status(404).json({ ok: false, err: { message: `Usuario con email: ${email} no encontrado` } });
        let passresetkey = shortid.generate();

        await Empleado.update({ passresetkey }, {
            where: {
                id: empleadoDB.id
            }
        });

        let message = {
            to: email,
            subject: `Registrate App | Reestablece tu contraseña`,
            html: `<div style="background-color: #f6f6f6ff; padding: 12px; font-family:font-family: Arial, Helvetica, sans-serif ''">
            <h3>Cambio de contraseña</h3>
                <p style="text-align: justify;">Has solicitado un cambio de constraseña, ingresa al siguiente <a href="https://registrateapp.com.ec/login/configurar?key=${passresetkey} ">enlace </a> para escoger tu nueva constraseña.
                </p>
                <p>Si no deseas cambiar tu contraseña ignora este email y tu contraseña no cambiará.</p>
            </div>`
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
        if (!empleadoDB) return res.status(404).json({ ok: false, err: { message: `No se pudo encontrar al usuario` } });
        let { id, passresetkey } = empleadoDB;
        let encrypted = await bcrypt.hash(password, 10);
        let updated = await Empleado.update({ password: encrypted, passresetkey: '' }, {
            where: {
                id
            }
        });
        if (updated[0] === 0) return res.json({ ok: false, err: { message: 'No se pudo reestablecer el Password' } });
        return res.json({ ok: true, message: 'Password reestablecido satisfactoriamente' });

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
        if (!empresa) return res.status(404).json({ ok: false, err: { message: 'Empresa no encontrada' } });
        let empleados = await Empleado.findAll({
            where: { empresaid: id },
            attributes: ['id', 'nombres', 'apellidos', 'email', 'ci'],
            include: [
                { model: Cargo, attributes: ['id', 'nombre'] },
                { model: Empresa },
                { model: Rol }
            ]
        });
        return res.json({ ok: true, data: empleados });
    } catch (err) {
        next(err);
    }
}

export async function obtenerEmpleado(req, res, next) {
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
        if (!empleado) return res.status(404).json({ ok: false, err: { message: 'Usuario no encontrado' } });
        delete empleado.dataValues.password;
        return res.json({ ok: true, data: empleado });
    } catch (err) {
        next(err);
    }
}

export async function modificarEmpleado(req, res, next) {
    const { nombres, apellidos, ci, email, cargoid } = req.body;
    const { id } = req.params;
    try {
        let updated = await Empleado.update({ nombres, apellidos, ci, email, cargoid }, {
            where: {
                id
            }
        }, {
            fields: ['nombres', 'apellidos', 'ci', 'email', 'cargoid']
        });
        if (updated[0] === 0) return res.status(404).json({ ok: false, err: { message: 'Usuario no encontrado' } });
        return res.json({ ok: true, message: 'Empleado actualizado satisfactoriamente' });
    } catch (err) {
        next(err);
    }
}

export async function eliminarEmpleado(req, res, next) {
    const { id } = req.params;
    try {
        let deleted = await Empleado.destroy({
            where: {
                id
            }
        });
        if (deleted === 0) return res.status(404).json({ ok: false, err: { message: 'Empleado no encontrado' } });
        return res.json({ ok: true, message: 'Empleado eliminado satisfactoriamente' });

    } catch (err) {
        next(err);
    }
}