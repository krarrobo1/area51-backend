import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
//Routes
import empresaRoutes from './routes/empresa';
import empleadoRoutes from './routes/empleado';
import cargoRoutes from './routes/cargo';
import periodoRoutes from './routes/periodo';
import dispositivoRoutes from './routes/dispositivo';
import asistenciaRoutes from './routes/asistencia';
import detallepermiso from './routes/detallepermiso';
import login from './routes/login';

const app = express();




// Middlewares
app.use(cors());
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

app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(500).json({ ok: false, err: { message: err.message } });
});

export default app;