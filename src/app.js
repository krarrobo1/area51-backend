import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
//Routes
import empresaRoutes from './routes/empresa';
import empleadoRoutes from './routes/empleado';
import cargoRoutes from './routes/cargo';
import periodoRoutes from './routes/periodo';
import dispositivoRoutes from './routes/dispositivo';
import asistenciaRoutes from './routes/asistencia';
import detallepermiso from './routes/detallepermiso';
import login from './routes/login';
import rol from './routes/rol';
import permiso from './routes/permiso';
import utils from './routes/utils';
import dia from './routes/dia';


const app = express();


// Middlewares
app.use(cors());
// Logger
app.use(morgan('dev'));
app.use(json());


app.use('/api/empresa', empresaRoutes);
app.use('/api/empleado', empleadoRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/periodo', periodoRoutes);
app.use('/api/dispositivo', dispositivoRoutes);
app.use('/api/asistencia', asistenciaRoutes);
app.use('/api/permiso', detallepermiso);
app.use('/api/login', login);
app.use('/api/rol', rol);
app.use('/api/permiso', permiso);
app.use('/api/utils', utils);
app.use('/api/dias', dia);

app.use(function(err, req, res, next) {
    let { name, message } = err;
    console.log(`Server Error: ${err}`);
    if (message === 'Validation error') {
        let stack = err.errors[0].message;
        return res.status(500).json({ ok: false, err: { message: `ErrorDeValidacion: ${stack}` } });
    }
    if (name === 'SequelizeDatabaseError') {
        return res.status(500).json({ ok: false, err: { message: `Database Error: ${message}` } });
    } else {
        return res.status(500).json({ ok: false, err: { message } });
    }
});

export default app;