import React, { useEffect, useState} from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const Map = () => {
    const [clickedLocation, setClickedLocation] = useState(null);
    const [key, setKey] = useState(null);

    useEffect(() => {
        fetch(`/api/env/MAP_API_KEY`)
            .then(response => response.json())
            .then(data => {
                setKey(data.key);
            })
            .catch(error => console.error(error));
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
                    center={{ lat: 7.0608, lng: 125.5805 }} // Davao City coordinates
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