import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

import Cargo from '../models/Cargo';


const Empresa = sequelize.define('empresa', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING,
        unique: {
            message: 'Oops.. ya existe una empresa asociada con este nombre.'
        }
    },
    latitud: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    longitud: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    radio: {
        type: Sequelize.NUMBER,
        allowNull: false
    },
    estado: {
        type: Sequelize.BOOLEAN
    },
    direccion: {
        type: Sequelize.STRING
    }
}, {
    timestamps: false
});




Empresa.hasMany(Cargo, { foreignKey: 'empresaid', sourceKey: 'id' });
Cargo.belongsTo(Empresa, { foreignKey: 'empresaid', sourceKey: 'id' });



export default Empresa;