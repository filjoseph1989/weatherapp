import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';

const Weather = ({ lat, lon }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await axios.get(`/weather/coordinates/${lat},${lon}`);
                setWeatherData(response.data);
            } catch (error) {
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
            }
        };

        if (lat && lon) {
            fetchWeatherData();
        }
    }, [lat, lon]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container">
            <div className="weather-side">
                <div className="weather-gradient"></div>
                <div className="date-container">
                    <h2 className="date-dayname text-2xl font-bold">
                        {weatherData.weather[0].main}
                    </h2>
                    <span className="date-day text-lg">
                        {new Intl.DateTimeFormat('en-US', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        }).format(new Date(weatherData.dt * 1000))}
                    </span>
                    <i className="location-icon" data-feather="map-pin"></i>
                    <span className="location">
                        {weatherData.name}, {weatherData.sys.country}
                    </span>
                </div>
                <div className="weather-container">
                    <div style={{ position: 'relative' }}>
                        <i className="weather-icon" data-feather="10" style={{
                            backgroundImage: `url(https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png)`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            display: 'block',
                            width: '200px',
                            height: '200px',
                            margin: '0 auto',
                            position: 'absolute',
                            top: '-140px',
                            left: '-30px'
                        }}></i>
                    </div>
                    <h1 className="weather-temp">{Math.round(weatherData.main.temp - 273.15)}°C</h1>
                    <h3 className="weather-desc">{weatherData.weather[0].description}</h3>
                </div>
            </div>
            <div className="info-side">
                <div className="today-info-container">
                    <div className="today-info">
                        <div className="precipitation">
                            <span className="title align-right">PRECIPITATION</span>
                            <span className="value align-left">{weatherData.clouds.all}%</span>
                        </div>
                        <div className="humidity">
                            <span className="title align-right">HUMIDITY</span>
                            <span className="value align-left">{weatherData.main.humidity}%</span>
                        </div>
                        <div className="wind">
                            <span className="title">WIND</span>
                            <span className="value">{weatherData.wind.speed} km/h</span>
                        </div>
                    </div>
                </div>
                <div className="week-container">
                    <ul className="week-list">
                        {weatherData.weather.map((day, index) => (
                            <li key={index} className={index === 0 ? 'active' : ''}>
                                <i className="weather-icon" data-feather={`${weatherData.weather[0].icon.slice(0, 2)}n`} style={{
                                    backgroundImage: `url(https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png)`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    display: 'block',
                                    width: '50px',
                                    height: '50px',
                                    margin: '0 auto',
                                }}></i>
                                <span className="day-name">
                                    {new Date(weatherData.dt * 1000 + index * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' })}
                                </span>
                                <span className="day-temp">{Math.round(weatherData.main.temp - 273.15)}°C</span>
                            </li>
                        ))}
                        <li>
                            <WeatherCard
                                weatherData={weatherData}
                                dayName="Sat"
                                dayTemp={Math.round(weatherData.main.temp - 273.15)} />
                        </li>
                        <li>
                            <WeatherCard
                                weatherData={weatherData}
                                dayName="Sun"
                                dayTemp={Math.round(weatherData.main.temp - 273.15)} />
                        </li>
                        <li>
                            <WeatherCard
                                weatherData={weatherData}
                                dayName="Mon"
                                dayTemp={Math.round(weatherData.main.temp - 273.15)} />
                        </li>
                    </ul>
                </div>
                <div className="location-container">
                    <button className="location-button">
                        <i data-feather="map-pin"></i>
                        <span>Pick location</span>
                    </button>
                </div>
            </div>
        </div>
    )

};

export default Weather;