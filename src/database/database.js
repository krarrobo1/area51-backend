import Sequelize from 'sequelize';
import { dburi, dbconfig } from '../config/config';

export const sequelize = new Sequelize(dburi, dbconfig);
(tryConnection());


async function tryConnection() {
    try {
        await sequelize.authenticate();
        console.log('DB Connection has been established successfully.');
    } catch (err) {
        console.log(`Unable to connect to the database: `, err);
    }
}