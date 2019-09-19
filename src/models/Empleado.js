import Sequelize from 'sequelize';
import { sequelize } from '../database/database';


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




export default Empleado;