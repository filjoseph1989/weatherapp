import React, { useEffect, useState} from 'react';
import { endpoints } from '../config/endpoints';
import { Loader } from "@googlemaps/js-api-loader"

const Map = () => {
    const [clickedLocation, setClickedLocation] = useState(null);
    const [key, setKey] = useState(localStorage.getItem('mapKey'));
    const [center, setCenter] = useState({ lat: 7.0608, lng: 125.5805 }); // Davao coordinate
    const [loader, setLoader] = useState(null);

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

    useEffect(() => {
        if (key) { // Check if key is available
            let loaderLocal = new Loader({
                apiKey: key,
                version: "weekly",
                libraries: ["places"]
            });
            setLoader(loaderLocal);
        }
    }, [key]);

    useEffect(() => {
        if (loader) {
            loader.load().then(async (google) => {
                const { Map } = await google.maps.importLibrary("maps");
                const map = new Map(document.getElementById("map"), {
                    center: center,
                    zoom: 8,
                });
                map.addListener("click", (e) => {
                    setClickedLocation(e.latLng);
                });
            });
        }
    }, [loader]);

    return (
        <div className='w-[800px]'>
            <h1>Map</h1>
            <div id="map" className='h-[500px]'></div>
            {clickedLocation && (
                <div>
                    Clicked location: Latitude: {clickedLocation.lat().toFixed(4)}, Longitude: {clickedLocation.lng().toFixed(4)}
                </div>
            )}
        </div>
    );
}

export default Map;