import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Empleado from './Empleado';
import Periodo from './Periodo';

const Cargo = sequelize.define('cargo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});

Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });

Cargo.hasMany(Periodo, { foreignKey: 'cargoid', sourceKey: 'id' });
Periodo.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });




export default Cargo;