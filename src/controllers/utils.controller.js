export function getServerDate(req, res) {
    let dt = new Date().toString();
    return res.json({
        serverdate: dt
    });
}