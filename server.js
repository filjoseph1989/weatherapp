require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Controllers
const WeatherController = require('./app/controllers/weatherController');
const ForecastController = require('./app/controllers/forecastController');
const CityController = require('./app/controllers/cityController');
const EnvironmentController = require('./app/controllers/environmentController');

// Services
const MemoryCacheService = require('./app/cache/memoryCache');

// Use environment variable or default port
const port = process.env.PORT || 5000;

// Instantiate an objects
const weatherController = new WeatherController(MemoryCacheService);
const forecastController = new ForecastController(MemoryCacheService);
const cityController = new CityController(MemoryCacheService);
const envController = new EnvironmentController();

// Routes
app.get('/weather/:city', cityController.getCityWeather);
app.get('/weather/coordinates/:lat,:lon', weatherController.getWeatherDataByCoordinates);
app.get('/forecast/coordinates/:lat,:lon', forecastController.getDailyWeatherForecastByCoordinates);
app.get('/env/:key', envController.getEnvValue);

// Development state
if (process.env.NODE_ENV === 'production') {
    console.log('Running in production mode');
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