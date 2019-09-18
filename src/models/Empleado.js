import Sequelize from 'sequelize';
import { sequelize } from '../database/database';


const Empleado = sequelize.define('empleado', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    id_empresa: {
        type: Sequelize.INTEGER
    },
    id_cargo: {
        type: Sequelize.INTEGER
    },
    nombres: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    apellidos: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    ci: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT
    }

}, {
    timestamps: false
});




export default Empleado;