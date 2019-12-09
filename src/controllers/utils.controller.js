import * as dt from 'date-fns';
import io from '../index';
export function getServerDate(req, res) {
    let formated = dt.format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    return res.json({
        serverdate: formated
    });
}