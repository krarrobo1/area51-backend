require("@babel/polyfill");

import app from './app';
import { port, time } from './config/config';
import { marcarSalidas } from './services/task';
import cron from 'node-cron';


cron.schedule(time, marcarSalidas).start();

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});