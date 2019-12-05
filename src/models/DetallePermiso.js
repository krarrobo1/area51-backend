import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Permiso from '../models/Permiso';
import Empleado from '../models/Empleado';

import * as dt from 'date-fns';
const FORMAT = 'dd/MM/yyyy HH:mm:ss';


const DetallePermiso = sequelize.define('detallepermiso', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fechainicio: {
        type: 'TIMESTAMPTZ',
    },
    fechafin: {
        type: 'TIMESTAMPTZ'
    },
    estado: {
        type: Sequelize.ENUM(['aprobado', 'rechazado', 'enrevision']),
        defaultValue: 'enrevision'
    }
}, {
    timestamps: false
});

DetallePermiso.prototype.toJSON = function() {
    let values = Object.assign({}, this.get());
    values.fechainicio = dt.format(values.fechainicio, FORMAT);
    values.fechafin = dt.format(values.fechafin, FORMAT);
    return values;
}

Permiso.hasMany(DetallePermiso, { foreignKey: 'permisoid', sourceKey: 'id' });
DetallePermiso.belongsTo(Permiso, { foreignKey: 'permisoid', sourceKey: 'id' });

Empleado.hasMany(DetallePermiso, { foreignKey: 'empleadoid', sourceKey: 'id' });
DetallePermiso.belongsTo(Empleado, { foreignKey: 'empleadoid', sourceKey: 'id' });

export default DetallePermiso;