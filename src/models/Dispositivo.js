import Sequelize, { INTEGER, STRING, CIDR, MACADDR } from 'sequelize';
import { sequelize } from '../database/database';

import Empleado from '../models/Empleado';

const Dispositivo = sequelize.define('dispositivo', {
    id: {
        type: INTEGER,
        primaryKey: true
    },
    nombre: {
        type: STRING
    },
    ip: {
        type: CIDR
    },
    mac: {
        type: MACADDR
    },
    modelo: {
        type: STRING
    }
}, {
    timestamps: false
});

console.log(Empleado);

Empleado.hasMany(Dispositivo, { foreignKey: 'empleadoid', sourceKey: 'id' });
Dispositivo.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default Dispositivo;