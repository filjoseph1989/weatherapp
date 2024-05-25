require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const WeatherController = require('./weatherController');
const CityController = require('./app/controllers/cityController');
const MemoryCacheService = require('./app/cache/memoryCache');

// Use environment variable or default port
const port = process.env.PORT || 5000;

// Instantiate an objects
const weatherController = new WeatherController(MemoryCacheService);
const cityController = new CityController(MemoryCacheService);

// Routes
app.get('/weather/:city', cityController.getCityWeather);
app.get('/weather/coordinates/:lat,:lon', weatherController.getWeatherDataByCoordinates);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
} else {
    console.log('Running in development mode');

    // Serve development server during development for reactjs
    const { createProxyMiddleware } = require('http-proxy-middleware');
    const proxyMiddleware = createProxyMiddleware({
        target: 'http://localhost:3000',
        changeOrigin: true
    });
    app.use('/api', proxyMiddleware);
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});