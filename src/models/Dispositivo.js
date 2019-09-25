import Sequelize, { INTEGER, STRING, CIDR, MACADDR, BOOLEAN } from 'sequelize';
import { sequelize } from '../database/database';

import Empleado from '../models/Empleado';

const Dispositivo = sequelize.define('dispositivo', {
    id: {
        type: INTEGER,
        primaryKey: true
    },
    nombre: {
        type: STRING,
        allowNull: false
    },
    ip: {
        type: CIDR,
        allowNull: false
    },
    mac: {
        type: MACADDR,
        allowNull: false
    },
    modelo: {
        type: STRING,
        allowNull: true
    },
    estado: {
        type: BOOLEAN
    }
}, {
    timestamps: false
});

console.log(Empleado);

Empleado.hasMany(Dispositivo, { foreignKey: 'empleadoid', sourceKey: 'id' });
Dispositivo.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default Dispositivo;