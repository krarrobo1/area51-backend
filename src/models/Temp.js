import Sequelize from 'sequelize';
import { sequelize } from '../database/database';



const Temp = sequelize.define('temp',{
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    horafin: {
        type: Sequelize.TIME,
    },
    latitud: {
        type: Sequelize.NUMBER
    },
    longitud: {
        type: Sequelize.NUMBER
    },
    empleadoid:{
        type: Sequelize.INTEGER
    },
    dispositivoid:{
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
});

export default Temp;
