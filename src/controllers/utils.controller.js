export function getServerDate(req, res) {
    return res.json({
        serverdate: new Date()
    });
}