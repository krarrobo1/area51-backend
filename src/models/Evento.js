import Sequelize, { INTEGER, STRING } from 'sequelize';
import { sequelize } from '../database/database';

const Evento = sequelize.define('evento', {
    id: {
        type: INTEGER,
        primaryKey: true
    },
    nombre: {
        type: STRING
    }
}, {
    timestamps: false
});


export default Evento;