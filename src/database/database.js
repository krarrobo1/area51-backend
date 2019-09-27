import Sequelize from 'sequelize';
import { dburi, dbconfig } from '../config/config';

export const sequelize = new Sequelize(dburi, dbconfig);
//export const sequelize = new Sequelize(dburi);