import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Cargo from '../models/Cargo';
import Empresa from '../models/Empresa';
import Rol from '../models/Rol';


const Empleado = sequelize.define('empleado', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombres: {
        type: Sequelize.STRING,
        allowNull: false
    },
    apellidos: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ci: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        },
        unique: true
    },
    password: {
        type: Sequelize.TEXT,
    },
    passresetkey: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});

Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });



Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });
Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });

Empleado.belongsTo(Rol, { foreignKey: 'rolid', sourceKey: 'id' });
Rol.hasMany(Empleado, { foreignKey: 'rolid', sourceKey: 'id' });

/*
Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });

Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });
Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });
*/

export default Empleado;