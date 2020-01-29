import Sequelize from 'sequelize';
import { dburi, dbconfig } from '../config/config';

export const sequelize = new Sequelize(dburi, dbconfig);

// console.log('DBCONF!!!', ({ dbconf: sequelize }));


sequelize
    .authenticate()
    .then(() => {
        console.log('DB Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
//export const sequelize = new Sequelize(dburi);