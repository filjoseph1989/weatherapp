class EnvironmentController {
    constructor() { }

    getEnvValue = (req, res) => {
        const key = req.params.key;
        const value = process.env[key];
        if (value === undefined) {
            res.status(404).send(`No value found for key ${key}`);
        } else {
            res.json({ 'key': value });
        }
    }
}

module.exports = EnvironmentController;