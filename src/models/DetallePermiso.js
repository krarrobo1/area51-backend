import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Permiso from '../models/Permiso';
import Empleado from '../models/Empleado';

const DetallePermiso = sequelize.define('detallepermiso', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fechainicio: { // TODO: Cambiar condicion a not null
        type: 'TIMESTAMPTZ',
    },
    fechafin: {
        type: 'TIMESTAMPTZ'
    },
    estado: {
        type: Sequelize.BOOLEAN
    }
}, {
    timestamps: false
});

Permiso.hasMany(DetallePermiso, { foreignKey: 'permisoid', sourceKey: 'id' });
DetallePermiso.belongsTo(Permiso, { foreignKey: 'permisoid', sourceKey: 'id' });

Empleado.hasMany(DetallePermiso, { foreignKey: 'empleadoid', sourceKey: 'id' });
DetallePermiso.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default DetallePermiso;