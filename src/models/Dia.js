import Sequelize from 'sequelize';
import { sequelize } from '../database/database';



const Dia = sequelize.define('dia', {
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



export default Dia;