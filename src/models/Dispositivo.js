import Sequelize, { INTEGER, STRING, BOOLEAN } from 'sequelize';
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
    modelo: {
        type: STRING,
        allowNull: true
    },
    imei: {
        type: STRING,
    },
    estado: {
        type: BOOLEAN
    },
    isweb: {
        type: BOOLEAN
    }
}, {
    timestamps: false
});



Empleado.hasMany(Dispositivo, { foreignKey: 'empleadoid', sourceKey: 'id' });
Dispositivo.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default Dispositivo;