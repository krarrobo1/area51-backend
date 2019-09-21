import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const Permiso = sequelize.define('permiso', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.STRING
    }
});

export default Permiso;