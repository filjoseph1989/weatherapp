import React, { useEffect, useState} from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { endpoints } from '../config/endpoints';

const Map = () => {
    const [clickedLocation, setClickedLocation] = useState(null);
    const [key, setKey] = useState(localStorage.getItem('mapKey'));
    const [center, setCenter] = useState({ lat: 7.0608, lng: 125.5805 }); // Davao coordinate

    useEffect(() => {
        const cachedKey = localStorage.getItem('mapKey');
        const isKeyExpired = localStorage.getItem('mapKeyExpiresAt');

        if (!cachedKey || (isKeyExpired && new Date(isKeyExpired) < new Date())) {
            fetch(endpoints.API_MAP_API_KEY)
                .then(response => response.json())
                .then(data => {
                    setKey(data.key);
                    localStorage.setItem('mapKey', data.key);
                    const now = new Date();
                    const expiration = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
                    localStorage.setItem('mapKeyExpiresAt', expiration.toISOString());
                })
                .catch(error => console.error(error));
        } else {
            setKey(cachedKey);
        }
    }, []);

    const handleMapClick = (e) => {
        setClickedLocation(e.latLng);
    };

    return (
        <div className='w-[500px]'>
            <h1>Map</h1>
            {key && (<LoadScript
                googleMapsApiKey={key}
                libraries={['places']} // Optional libraries for additional features
                loading="lazy" // Add loading="lazy" for asynchronous loading
                >
                <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '400px' }}
                    zoom={8}
                    center={center}
                    onClick={handleMapClick} >
                    {clickedLocation && (
                        <Marker position={clickedLocation} />
                    )}
                </GoogleMap>
            </LoadScript>)}
            {clickedLocation && (
                <div>
                    Clicked location: Latitude: {clickedLocation.lat().toFixed(4)}, Longitude: {clickedLocation.lng().toFixed(4)}
                </div>
            )}
        </div>
    );
}

export default Map;