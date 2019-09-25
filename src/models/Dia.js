import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Periodo from '../models/Periodo';

const Dia = sequelize.define('dias', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});

Periodo.belongsTo(Dia, { foreignKey: 'diaid', sourceKey: 'id' });
Dia.hasMany(Periodo, { foreignKey: 'diaid', sourceKey: 'id' });

export default Dia;