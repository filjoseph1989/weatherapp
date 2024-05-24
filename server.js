const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const apiUrl = process.env.OPENWEATHERMAP_API_URL;
const apiGeoUrl = process.env.OPENWEATHERMAP_GEO_URL;

// API endpoint to fetch weather data based on coordinates
const cache = require('memory-cache');
const path = require('path');

/**
 * This endpoint is used to fetch weather data for a given city.
 * It first checks if the data is already in the cache.
 * If it is, it sends the cached data.
 * If not, it fetches the data from the API, caches it for 10 minutes, and sends it.
 */
app.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;
        const cacheKey = city;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            res.json(cachedData);
        } else {
            const weatherResponse = await axios.get(`${apiGeoUrl}?q=${city}&limit=5&appid=${apiKey}`);
            const cities = {};
            weatherResponse.data.forEach(city => {
                cities[city.country] = city;
            });
            cache.put(cacheKey, cities, 1000 * 60 * 10); // cache for 10 minutes
            res.json(cities);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});


/**
 * This endpoint is used to fetch weather data for a given set of coordinates.
 *
 * It first checks if the data is already in the cache. If it is, it sends the
 * cached data. If not, it fetches the data from the API, caches it for 10
 * minutes, and sends it.
 */
app.get('/weather/coordinates/:lat,:lon', async (req, res) => {
    try {
        const { lat, lon } = req.params;
        const cacheKey = `${lat},${lon}`;
        let weatherData = cache.get(cacheKey);
        if (weatherData) {
            console.log('Fetching from cache');
        } else {
            console.log('Fetching from API');
            const weatherResponse = await axios.get(`${apiUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}`);
            weatherData = weatherResponse.data;
            cache.put(cacheKey, weatherData, 1000 * 60 * 10); // 10 minutes
        }
        res.json(weatherData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching weather data');
    }
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
} else {
    console.log('Running in development mode');

    // Serve development server during development
    const { createProxyMiddleware } = require('http-proxy-middleware');
    const proxyMiddleware = createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true
    });
    app.use('/api', proxyMiddleware);
}

// Use environment variable or default port
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});