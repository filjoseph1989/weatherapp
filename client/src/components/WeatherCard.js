import { endpoints } from "../config/endpoints";

const WeatherCard = ({ weatherData, day }) => {
    return (
        <div className="p-1 py-2 w-24">
            <i
                data-feather={weatherData?.weather?.[0]?.icon ? `${weatherData.weather[0].icon.slice(0, 2)}n` : ''}
                style={{
                    backgroundImage: `url(${endpoints.OPENWEATHERMAP_ICON_BASE_URL}/${day.icon}@2x.png)`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    display: 'block',
                    width: '50px',
                    height: '50px',
                    margin: '0 auto',
                }}>
            </i>
            <p className='text-center text-sm'>{day.main || ''}</p>
            <div className="text-[0.6rem] text-center">
                <span className="mr-1">{day.name || ''}</span>
                <span className="">{Math.round((weatherData?.main?.temp || 0) - 273.15) || ''}<sup>°C</sup></span>
            </div>
        </div>
    );
}

export default WeatherCard;