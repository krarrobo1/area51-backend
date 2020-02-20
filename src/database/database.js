import Sequelize from 'sequelize';
import { dbenv } from '../config/config';
console.log("DB!!!",dbenv);
export const sequelize = new Sequelize(dbenv.db, dbenv.config);

sequelize.authenticate()
    .then(() => {
        console.log('DB up!');
    })
    .catch((err) => {
        console.log('No se pudo conectar a la DB: ', err);
    });