import Sequelize from 'sequelize';
import { dburi, dbconfig } from '../config/config';

export const sequelize = new Sequelize(dburi, dbconfig);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
//export const sequelize = new Sequelize(dburi);