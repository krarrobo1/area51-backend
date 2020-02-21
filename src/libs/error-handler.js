export function errorHandler(err, req, res, next) {
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
}