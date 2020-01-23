import { Router } from 'express';
import { getServerDate, doPing } from '../controllers/utils.controller';

const router = new Router();

router.get('/date', getServerDate);
//router.post('/ping', doPing)

export default router;