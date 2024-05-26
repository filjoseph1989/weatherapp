const axios = require('axios');

class ForecastController {
    /**
     * Constructor for the WeatherController class.
     * @param {MemoryCacheService} memoryCacheService - The memory cache service instance.
     */
    constructor(MemoryCacheService) {
        this.memoryCacheService = MemoryCacheService;
        this.apiUrl = process.env.OPENWEATHERMAP_API_URL;
        this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
    }

    /**
     * Retrieves daily weather forecast data by coordinates.
     *
     * Note: This was not used in this app due limitation of API key.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @return {Promise} A promise that resolves to the weather forecast data.
     */
    getDailyWeatherForecastByCoordinates = async (req, res) => {
        const { lat, lon } = req.params;
        const cacheKey = `forecast-${lat},${lon}`;
        const cnt = 7;
        let forecastData = this.memoryCacheService.get(cacheKey);

        if (forecastData) {
            console.log('Fetching forecast from cache');
            return res.json(forecastData);
        }

        try {
            console.log('Fetching forecast from API');
            const url = `${this.apiUrl}/forecast/daily?lat=${lat}&lon=${lon}&cnt=${cnt}&appid=${this.apiKey}`;
            const response = await axios.get(url);
            forecastData = response.data;
            this.memoryCacheService.put(cacheKey, forecastData, 1000 * 60 * 60 * 24); // cache for 1 day
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching weather forecast data');
            return;
        }

        res.json(forecastData);
    }
}

module.exports = ForecastController;