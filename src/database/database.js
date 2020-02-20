import Sequelize from 'sequelize';
import { dburi,dbenv } from '../config/config';

console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',JSON.stringify(dbenv, null, 2));

export const sequelize = new Sequelize(dburi, dbenv);


sequelize.authenticate()
    .then(() => {
        console.log('DB up!');
    })
    .catch((err) => {
        console.log('No se pudo conectar a la DB: ', err);
    });