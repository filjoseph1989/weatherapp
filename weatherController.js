const axios = require('axios');
const cache = require('memory-cache');

class WeatherController {
    constructor() {
        this.apiGeoUrl = process.env.OPENWEATHERMAP_API_GEO_URL;
        this.apiUrl = process.env.OPENWEATHERMAP_API_URL;
        this.apiKey = process.env.OPENWEATHERMAP_API_KEY;
        this.limit = 10;
    }

    /**
     * Asynchronously gets weather data for a given city.
     *
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @return {Promise<void>} Resolves when the data is retrieved and sent.
     */
    getWeatherData = async (req, res) => {
        const city = req.params.city;
        const cacheKey = city;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            res.json(cachedData);
        } else {
            try {
                const weatherResponse = await axios.get(`${this.apiGeoUrl}?q=${city}&limit=${this.limit}&appid=${this.apiKey}`);
                const cities = {};
                weatherResponse.data.forEach((city) => {
                    cities[city.country] = city;
                });
                cache.put(cacheKey, cities, 1000 * 60 * 10); // cache for 10 minutes
                res.json(cities);
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching weather data');
            }
        }
    }

    getWeatherDataByCoordinates = async (req, res) => {
        const { lat, lon } = req.params;
        const cacheKey = `${lat},${lon}`;
        let weatherData = cache.get(cacheKey);

        if (weatherData) {
            console.log('Fetching from cache');
        } else {
            try {
                const weatherResponse = await axios.get(`${this.apiUrl}?lat=${lat}&lon=${lon}&appid=${this.apiKey}`);
                weatherData = weatherResponse.data;
                cache.put(cacheKey, weatherData, 1000 * 60 * 10); // cache for 10 minutes
            } catch (error) {
                console.error(error);
                res.status(500).send('Error fetching weather data');
                return;
            }
        }

        res.json(weatherData);
    }
}

module.exports = WeatherController;

