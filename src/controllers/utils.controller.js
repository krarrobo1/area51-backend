import * as dt from 'date-fns';
export function getServerDate(req, res) {
    let formated = dt.format(new Date(), 'dd/MM/yyyy HH:mm:ss');
    return res.json({
        serverdate: formated
    });
}