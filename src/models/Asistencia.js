import Sequelize, { INTEGER, STRING, CIDR, MACADDR, BOOLEAN } from 'sequelize';
import { sequelize } from '../database/database';

import Dispositivo from '../models/Dispositivo';
import Evento from '../models/Evento';
import Empleado from '../models/Empleado';

const Asistencia = sequelize.define('asistencias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    hora: {
        type: 'TIMESTAMPTZ'
    },
    latitud: {
        type: Sequelize.NUMBER
    },
    longitud: {
        type: Sequelize.NUMBER
    }
}, {
    timestamps: false
});

Asistencia.belongsTo(Dispositivo, { foreignKey: 'dispositivoid', sourceKey: 'id' });
Dispositivo.hasMany(Asistencia, { foreignKey: 'dispositivoid', sourceKey: 'id' });

Asistencia.belongsTo(Evento, { foreignKey: 'eventoid', sourceKey: 'id' });
Evento.hasMany(Asistencia, { foreignKey: 'eventoid', sourceKey: 'id' });

Asistencia.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });
Empleado.hasMany(Asistencia, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default Asistencia;