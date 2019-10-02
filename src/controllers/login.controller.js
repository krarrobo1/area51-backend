import Empleado from '../models/Empleado';
import Empresa from '../models/Empresa';
import Cargo from '../models/Cargo';
import Rol from '../models/Rol';
import Periodo from '../models/Periodo';
import Dia from '../models/Dia';

import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { seed } from '../config/config';

export async function LogIn(req, res) {
    const { email, password } = req.body;

    try {
        const empleadoTemp = await Empleado.findOne({
            attributes: ['id', 'nombres', 'apellidos', 'email', 'password'],
            where: {
                email
            },
            include: [
                { model: Empresa, attributes: ['id', 'nombre', 'latitud', 'longitud', 'radio'] },
                { model: Rol, attributes: ['nombre'] },
                { model: Cargo, attributes: ['nombre'], include: [{ model: Periodo, attributes: ['horainicio', 'horafin'], include: [{ model: Dia, attributes: ['nombre'] }] }] }
            ]
        });
        if (!empleadoTemp) {
            return res.status('401').json({ ok: false, message: 'Email* o password incorrectos...' });
        }
        let flag = await bcrypt.compare(String(password), empleadoTemp.password);
        if (!flag) {
            return res.status('401').json({ ok: false, message: 'Email o password* incorrectos...' });
        }
        let data = empleadoTemp.dataValues;
        delete data.password;

        let tkndata = { id: data.id, nombres: data.nombres, apellidos: data.apellidos, rol: data.role.nombre, email: data.email };
        const token = JWT.sign(tkndata, seed, { expiresIn: '12h' });

        return res.json({
            ok: true,
            data,
            token
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ ok: false, err });
    }

}