import Sequelize from 'sequelize';
import { dbdev, dbconfig } from '../config/config';



/*export const sequelize = new Sequelize(
    'nueva',
    'postgres',
    '', {
        host: 'localhost',
        dialect: 'postgres',
        pool: {
            max: 5,
            min: 0,
            require: 30000,
            idle: 10000
        },
        loggin: false
    }
);*/

export const sequelize = new Sequelize(dbdev, dbconfig);