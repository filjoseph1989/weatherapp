import { endpoints } from "../config/endpoints";

const WeatherCard = ({ weatherData, dayName, dayTemp }) => {
    return (
        <div>
            <i className="weather-icon" data-feather={`${weatherData.weather[0].icon.slice(0, 2)}n`} style={{
                backgroundImage: `url(${endpoints.OPENWEATHERMAP_ICON_BASE_URL}/${weatherData.weather[0].icon}@2x.png)`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                display: 'block',
                width: '50px',
                height: '50px',
                margin: '0 auto',
            }}></i>
            <span className="day-name">{dayName}</span>
            <span className="day-temp">{dayTemp}°C</span>
        </div>
    );
}

export default WeatherCard;