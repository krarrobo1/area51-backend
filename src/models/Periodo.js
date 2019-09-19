import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Dia from './Dia';


const Periodo = sequelize.define('periodo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    horainicio: {
        type: Sequelize.TIME,
    },
    horafin: {
        type: Sequelize.TIME
    }
}, {
    timestamps: false
});

Periodo.belongsTo(Dia, { foreignKey: 'diaid', sourceKey: 'id' });
Dia.hasMany(Periodo, { foreignKey: 'diaid', sourceKey: 'id' });



export default Periodo;