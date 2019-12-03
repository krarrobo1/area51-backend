import Sequelize, { INTEGER, STRING, CIDR, MACADDR, BOOLEAN } from 'sequelize';
import { sequelize } from '../database/database';

import Dispositivo from '../models/Dispositivo';
import Evento from '../models/Evento';


import * as dt from 'date-fns';
const FORMAT = 'dd/MM/yyyy HH:mm:ss';


const Asistencia = sequelize.define('asistencias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    hora: {
        type: 'TIMESTAMPTZ',
        default: Sequelize.NOW
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

Asistencia.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());
    values.hora = dt.format(values.hora, FORMAT);
    return values;
}

Asistencia.belongsTo(Dispositivo, { foreignKey: 'dispositivoid', sourceKey: 'id' });
Dispositivo.hasMany(Asistencia, { foreignKey: 'dispositivoid', sourceKey: 'id' });

Asistencia.belongsTo(Evento, { foreignKey: 'eventoid', sourceKey: 'id' });
Evento.hasMany(Asistencia, { foreignKey: 'eventoid', sourceKey: 'id' });


export default Asistencia;