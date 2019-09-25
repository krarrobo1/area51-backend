import Sequelize from 'sequelize';
import { sequelize } from '../database/database';

const Rol = sequelize.define('role', {
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

export default Rol;