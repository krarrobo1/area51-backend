import express, { json } from 'express';
import morgan from 'morgan';
//Routes
import empresaRoutes from './routes/empresa';
import empleadoRoutes from './routes/empleado';
import cargoRoutes from './routes/cargo';
import periodoRoutes from './routes/periodo';

const app = express();




// Middlewares
app.use(morgan('dev'));

app.use(json());

app.use('/api/empresa', empresaRoutes);
app.use('/api/empleado', empleadoRoutes);
app.use('/api/cargo', cargoRoutes);
app.use('/api/periodo', periodoRoutes);

export default app;