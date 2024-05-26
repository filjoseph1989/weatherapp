import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherCard from './WeatherCard';
import { endpoints } from '../config/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import GenericWeatherComponent from './GenericWeatherComponent';

const Weather = ({ selectedCity }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [weekdays, setWeekdays] = useState([]);

    useEffect(() => {
        const fetchWeatherData = async (lat, lon) => {
            try {
                const response = await axios.get(`${endpoints.API_WEATHER_COORDINATES}/${lat},${lon}`);
                if (selectedCity.name) {
                    response.data.name = selectedCity.name;
                }
                setWeatherData(response.data);
            } catch (error) {
                setError('Error fetching weather data');
            } finally {
                setLoading(false);
            }
        };

        if (selectedCity) {
            fetchWeatherData(selectedCity.lat, selectedCity.lon);
        }
    }, [selectedCity]);

    useEffect(() => {
        if (weatherData) {
            let days = [];
            weatherData.weather.map((day, index) => {
                let dayName = new Date(weatherData.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
                let dayInfo = {
                    name: dayName,
                    icon: day.icon,
                    description: day.description,
                    main: day.main,
                    id: day.id
                }
                days[index] = dayInfo;
            });
            setWeekdays(days);
        }
    }, [weatherData]);

    const [weatherDetails, setWeatherDetails] = useState([]);

    useEffect(() => {
        if (weatherData) {
            const newWeatherDetails = [
                { name: 'PRECIPITATION', value: weatherData.clouds.all + '%' },
                { name: 'HUMIDITY', value: weatherData.main.humidity + '%' },
                { name: 'WIND', value: weatherData.wind.speed + ' km/h' },
                { name: 'TEMP', value: Math.round(weatherData.main.temp - 273.15) + '°C' },
                { name: 'FEELS LIKE', value: Math.round(weatherData.main.feels_like - 273.15) + '°C' },
                { name: 'TEMP MIN', value: Math.round(weatherData.main.temp_min - 273.15) + '°C' },
                { name: 'TEMP MAX', value: Math.round(weatherData.main.temp_max - 273.15) + '°C' },
                { name: 'PRESSURE', value: weatherData.main.pressure + ' hPa' }
            ];
            setWeatherDetails(newWeatherDetails);
        }
    }, [weatherData]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className='md:grid md:grid-cols-2 sm:flex sm:flex-col'>
            <div className="relative h-[500px] bg-cover bg-center w-full overflow-hidden transition-all duration-300 hover:scale-105 hover:rounded-3xl"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1559963110-71b394e7494d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80')"
                }}>
                <div class="w-full h-full bg-cover bg-center bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 opacity-80"></div>
                <div className="absolute top-3 w-full h-1/2 px-5 text-white">
                    <div className='flex flex-col h-1/2 items-left justify-center'>
                        <h2 className="date-dayname text-2xl font-bold text-4xl">
                            {weatherData?.weather?.[0]?.main}
                        </h2>
                        <h4 className="date-day text-md mb-4">
                            {new Intl.DateTimeFormat('en-US', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            }).format(new Date(weatherData.dt * 1000))}
                        </h4>
                        <div className='text-xl font-bold'>
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                            <span className="ml-2">
                                {weatherData.name || selectedCity.name}, {weatherData.sys.country}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="h-1/2 w-full absolute top-1/2">
                    <div className='flex flex-col items-left justify-center'>
                        <div className='relative h-[140px]'>
                            <i
                                className="absolute top-[-50px] left-[-30px]"
                                data-feather="10"
                                style={{
                                    backgroundImage: `url(${endpoints.OPENWEATHERMAP_ICON_BASE_URL}/${weatherData.weather[0].icon}@2x.png)`,
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    display: 'block',
                                    width: '250px',
                                    height: '250px',
                                    margin: '0 auto',
                                }}>
                            </i>
                        </div>
                        <div className='flex flex-col px-5 items-left justify-center text-white'>
                            <h1 className="text-6xl font-bold">{Math.round(weatherData.main.temp - 273.15)}<sup>°C</sup></h1>
                            <h3 className="text-xl capitalize">{weatherData.weather[0].description}</h3>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[500px] flex flex-wrap items-center justify-center bg-gray-600 text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:rounded-3xl">
                <div className="w-full">
                    <div className="px-6">
                        {weatherDetails.map((detail, index) => {
                            return (
                                <GenericWeatherComponent
                                    key={index}
                                    label={detail.name}
                                    value={detail.value} />
                            );
                        })}
                    </div>
                    <div className='flex flex-col justify-center my-4 mx-5'>
                        <ul className="bg-black rounded-lg p-4">
                            {weekdays.map((day, index) => {
                                return (
                                    <li key={index}
                                        className="text-black"
                                        style={{
                                            display: 'inline-block',
                                            cursor: 'pointer',
                                            transition: '200ms ease',
                                            borderRadius: '10px',
                                            marginRight: '6px',
                                            backgroundColor: 'white',
                                        }}>
                                        <WeatherCard
                                            day={day}
                                            weatherData={weatherData} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Weather;