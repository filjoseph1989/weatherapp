const { default: axios } = require("axios");
const WeatherController = require("../app/controllers/weatherController");

describe('WeatherController', () => {
    let mockReq, mockRes, memoryCacheService, weatherController;

    beforeEach(() => {
        mockReq = { params: { lat: '123', lon: '456' } };
        mockRes = { json: jest.fn(), status: jest.fn().mockReturnThis(), send: jest.fn() };
        memoryCacheService = { get: jest.fn(), put: jest.fn() };
        weatherController = new WeatherController(memoryCacheService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return weather data from cache', async () => {
        const cachedData = { foo: 'bar' };
        memoryCacheService.get.mockReturnValue(cachedData);

        await weatherController.getWeatherDataByCoordinates(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(cachedData);
        expect(memoryCacheService.get).toHaveBeenCalledWith(`${mockReq.params.lat},${mockReq.params.lon}`);
    });

    it('should return weather data from API', async () => {
        const responseData = { foo: 'bar' };
        const axiosMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: responseData });

        await weatherController.getWeatherDataByCoordinates(mockReq, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith(responseData);
        expect(memoryCacheService.put).toHaveBeenCalledWith(`${mockReq.params.lat},${mockReq.params.lon}`, responseData, 1000 * 60 * 10);
        expect(axiosMock).toHaveBeenCalledWith(`${process.env.OPENWEATHERMAP_API_URL}/weather?lat=123&lon=456&appid=${process.env.OPENWEATHERMAP_API_KEY}`);
        axiosMock.mockRestore();
    });

    it('should handle API error', async () => {
        const axiosMock = jest.spyOn(axios, 'get').mockRejectedValue(new Error('API error'));

        await weatherController.getWeatherDataByCoordinates(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith('Error fetching weather data');
        axiosMock.mockRestore();
    });
});