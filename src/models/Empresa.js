import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Cargo from '../models/Cargo';
import Empleado from '../models/Empleado';
const Empresa = sequelize.define('empresa', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING(50)
    },
    latitud: {
        type: Sequelize.NUMBER
    },
    longitud: {
        type: Sequelize.NUMBER
    },
    estado: {
        type: Sequelize.BOOLEAN
    }
}, {
    timestamps: false
});


Empresa.hasMany(Cargo, { foreignKey: 'empresaid', sourceKey: 'id' });
Cargo.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });

Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });
Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });

export default Empresa;