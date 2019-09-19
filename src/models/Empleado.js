import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Cargo from '../models/Cargo';
import Empresa from '../models/Empresa';


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
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT
    }

}, {
    timestamps: false
});

Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });



Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });
Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });


/*
Cargo.hasMany(Empleado, { foreignKey: 'cargoid', sourceKey: 'id' });
Empleado.belongsTo(Cargo, { foreignKey: 'cargoid', sourceKey: 'id' });

Empleado.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });
Empresa.hasMany(Empleado, { foreignKey: 'empresaid', sourceKey: 'id' });
*/

export default Empleado;