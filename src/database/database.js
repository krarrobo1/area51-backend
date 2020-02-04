import Sequelize from 'sequelize';
import { dburi, dbconfig } from '../config/config';

export const sequelize = new Sequelize(dburi, dbconfig);

sequelize.authenticate()
    .then(() => {
        console.log('DB up!');
    })
    .catch((err) => {
        console.log('No se pudo conectar a la DB: ', err);
    });