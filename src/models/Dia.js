import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Periodo from './Periodo';

const Dia = sequelize.define('dia', {
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

//Dia.hasMany(Periodo, { foreignKey: 'diaid', sourceKey: 'id' });

export default Dia;