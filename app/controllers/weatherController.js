const axios = require('axios');

class WeatherController {
    /**
     * Constructor for the WeatherController class.
     * @param {MemoryCacheService} memoryCacheService - The memory cache service instance.
     */
    constructor(MemoryCacheService) {
        this.memoryCacheService = MemoryCacheService;
        this.apiUrl = process.env.OPENWEATHERMAP_API_URL;
        this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
        this.limit = 10;
    }

    /**
     * Retrieves weather data by coordinates.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @return {Promise} A promise that resolves to the weather data.
     */
    getWeatherDataByCoordinates = async (req, res) => {
        const { lat, lon } = req.params;
        const cacheKey = `${lat},${lon}`;
        let weatherData = this.memoryCacheService.get(cacheKey);

        if (weatherData) {
            console.log('Fetching from cache');
            res.json(weatherData);
        }

        try {
            console.log('Fetching from API');
            const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
            const weatherResponse = await axios.get(url);
            weatherData = weatherResponse.data;
            this.memoryCacheService.put(cacheKey, weatherData, 1000 * 60 * 10); // cache for 10 minutes
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching weather data');
            return;
        }

        res.json(weatherData);
    }
}

module.exports = WeatherController;