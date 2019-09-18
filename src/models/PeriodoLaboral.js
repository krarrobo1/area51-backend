import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Cargo from '../models/Cargo';
import Dia from '../models/Dia';

const PeriodoLaboral = sequelize.define('periodolaboral', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    horainicio: {
        type: Sequelize.TIME
    },
    horafin: {
        type: Sequelize.TIME
    }
});

PeriodoLaboral.belongsTo(Cargo, { foreingKey: 'cargoid', sourceKey: 'id' });
Cargo.hasMany(PeriodoLaboral, { foreingKey: 'cargoid', sourceKey: 'id' });

Dia.hasMany(PeriodoLaboral, { foreingKey: 'diaid', sourceKey: 'id' });
PeriodoLaboral.belongsTo(Dia, { foreingKey: 'diaid', sourceKey: 'id' });

export default PeriodoLaboral;