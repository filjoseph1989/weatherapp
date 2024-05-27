const EnvironmentController = require('../app/controllers/environmentController');

describe('EnvironmentController', () => {
    let req, res;

    afterEach(() => {
        delete process.env.TEST_KEY;
    });

    beforeEach(() => {
        req = { params: { key: 'TEST_KEY' } };
        res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            json: jest.fn(),
        };
    });

    it('should return the correct value for an existing key', () => {
        // Set the TEST_KEY environment variable so that it can be tested
        process.env.TEST_KEY = 'TEST_VALUE';
        const controller = new EnvironmentController();
        controller.getEnvValue(req, res);
        expect(res.json).toHaveBeenCalledWith({ key: 'TEST_VALUE' });
    });

    it('should return a 404 for a non-existing key', () => {
        // Now that we dont set the TEST_KEY environment variable, it should return 404
        const controller = new EnvironmentController();
        controller.getEnvValue(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.send).toHaveBeenCalledWith(`No value found for key TEST_KEY`);
    });
});