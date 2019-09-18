import Sequelize from 'sequelize';
import { sequelize } from '../database/database';


const Cargo = sequelize.define('cargo', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: {
        type: Sequelize.TEXT
    }
}, {
    timestamps: false
});


export default Cargo;