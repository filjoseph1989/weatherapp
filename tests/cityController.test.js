const { default: axios } = require('axios');
const CityController = require('../app/controllers/cityController');

describe("CityController", () => {
    // Here we define a mock service for caching
    const mockCacheService = {
        get: jest.fn(),
        put: jest.fn(),
    };

    // Then use this mock object on the controller
    const cityController = new CityController(mockCacheService);

    // Mock the axios.get() call to return a predefined mock response
    const mockResponse = { data: [{ id: 1, country: "US" }, { id: 2, country: "UK" }] };
    jest.spyOn(axios, "get").mockResolvedValue(mockResponse);

    afterEach(() => {
        jest.clearAllMocks(); // Reset all mocks after each test
    });

    it("fetches weather data for a city", async () => {
        const mockRequest = { params: { city: "New York" } };
        const mockResponse = { json: jest.fn() };
        await cityController.getCityWeather(mockRequest, mockResponse);
        expect(mockCacheService.get).toHaveBeenCalledWith("New York");
        expect(axios.get).toHaveBeenCalledWith(
            `${process.env.OPENWEATHERMAP_GEO_URL}?q=New York&limit=10&appid=${process.env.OPENWEATHERMAP_API_KEY}`
        );
        expect(mockCacheService.put).toHaveBeenCalledWith(
            "New York",
            { US: { id: 1, country: "US" }, UK: { id: 2, country: "UK" } },
            600000
        );
        expect(mockResponse.json).toHaveBeenCalledWith(undefined);
    });

    it("returns cached data if available", async () => {
        const mockRequest = { params: { city: "London" } };
        const mockResponse = { json: jest.fn() };
        mockCacheService.get.mockReturnValueOnce({ UK: { id: 2, country: "UK" } });
        await cityController.getCityWeather(mockRequest, mockResponse);
        expect(mockCacheService.get).toHaveBeenCalledWith("London");
        expect(axios.get).not.toHaveBeenCalled();
        expect(mockCacheService.put).not.toHaveBeenCalled();
        expect(mockResponse.json).toHaveBeenCalledWith({ UK: { id: 2, country: "UK" } });
    });
});
