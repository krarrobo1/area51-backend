import Sequelize from 'sequelize';
import { dbenv } from '../config/config';



//export const sequelize = new Sequelize(dburi, dbenv);
let { username, password, database } = dbenv.db;
export const sequelize = new Sequelize(database, username, password, dbenv.config)


sequelize.authenticate()
    .then(() => {
        console.log('DB up!');
    })
    .catch((err) => {
        console.log('No se pudo conectar a la DB: ', err);
    });