const axios = require("axios");

class CityController {
    /**
     * Controller class for handling city weather data
     */
    constructor(MemoryCacheService) {
        this.apiGeoUrl = process.env.OPENWEATHERMAP_GEO_URL;
        this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
        this.limit = 10;
        this.cacheService = MemoryCacheService;
    }

    /**
     * Fetches weather data for a given city
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @returns {Promise} Resolves with weather data for the specified city
     */
    getCityWeather = async (req, res) => {
        const city = req.params.city;
        const cacheKey = city;
        const cachedData = this.cacheService.get(cacheKey);

        if (cachedData) {
            return res.json(cachedData);
        }

        try {
            const response = await this.fetchWeatherData(city);
            const cities = this.transformWeatherData(response.data);
            this.cacheService.put(cacheKey, cities, 1000 * 60 * 10); // cache for 10 minutes
            return res.json(cachedData);
        } catch (error) {
            return res.status(500).send('Error fetching weather data');
        }
    }

    /**
     * Fetches weather data from the API
     * @param {string} city - City name
     * @returns {Promise} Resolves with the API response
     */
    fetchWeatherData = async (city) => {
        const url = `${this.apiGeoUrl}?q=${city}&limit=${this.limit}&appid=${this.apiKey}`;
        const response = await axios.get(url);
        return response;
    }

    /**
     * Transforms the API response into a format suitable for the client
     * @param {Array} data - API response data
     * @returns {Object} Object containing weather data for each city
     */
    transformWeatherData = (data) => {
        const cities = {};
        data.forEach((city) => {
            cities[city.country] = city;
        });
        return cities;
    }
}

module.exports = CityController;