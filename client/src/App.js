import './App.css';
import React, { useEffect, useState } from 'react';
import Weather from './components/Weather';
import SearchForm from './components/SearchForm';
import { endpoints } from './config/endpoints';
import { Loader } from '@googlemaps/js-api-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [clickedLocation, setClickedLocation] = useState(null);
  const [key, setKey] = useState(localStorage.getItem('mapKey'));
  const [loader, setLoader] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (selectedCity == null) {
      setSelectedCity({ lat: 7.0608, lon: 125.5805 });
    }
  }, [selectedCity]);

  useEffect(() => {
    const cachedKey = localStorage.getItem('mapKey');
    const isKeyExpired = localStorage.getItem('mapKeyExpiresAt');

    if (!cachedKey || (isKeyExpired && new Date(isKeyExpired) < new Date())) {
      const url = `/${endpoints.API_MAP_API_KEY}`;
      fetch(url)
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
          center: { lat: 7.0608, lng: 125.5805 }, // Davao coordinate
          zoom: 8,
        });
        map.addListener("click", (e) => {
          setClickedLocation(e.latLng);
        });
      });
    }
  }, [loader]);

  useEffect(() => {
    if (clickedLocation) {
      setSelectedCity({ lat: clickedLocation.lat().toFixed(4), lon: clickedLocation.lng().toFixed(4) });
    }
  }, [clickedLocation]);

  const handleSearchSubmit = async (city) => {
    if (!city) {
      return;
    }

    try {
      const url = `/${endpoints.API_WEATHER_BY_CITY}/${city}`;
      const response = await fetch(url);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('An error occurred while searching for the city. Please try again.');
    }
  };

  const handleCitySelect = (cityObject) => {
    setSelectedCity(cityObject);
    setSearchResults([]);
  };

  return (
    <>
      <div className="container mx-auto">
        <div className='mb-4'>
          <SearchForm
            onSearchSubmit={handleSearchSubmit} />
          <p className="mt-2 text-sm text-yellow-600">
            <FontAwesomeIcon
              className='mr-2'
              icon={faInfoCircle} />
            If no results are shown, please try clicking the submit button again.
          </p>
        </div>
        {searchResults && (
          <ul className="flex flex-col space-y-2 mb-4 mt-2">
            {Object.values(searchResults).map((cityObject) => {
              return (
                <li key={`${cityObject.name}-${cityObject.country}`}
                  className="flex items-center border rounded p-2">
                  <span className="flex-1">{cityObject.name}, {cityObject.country}</span>
                  <button className="" onClick={() => handleCitySelect(cityObject)}> Select </button>
                </li>
              )
            })}
          </ul>
        )}
        <div className='lg:grid lg:grid-cols-[600px_1fr] rounded sm:flex sm:flex-col'>
          <div id="map" className='h-[500px] sm:w-full'></div>
          <div className=''>
            <Weather selectedCity={selectedCity} />
          </div>
        </div>
      </div>
      <footer className="mt-4 border-t-2 border-gray-200 py-4 text-center text-sm text-gray-500">
        <p>
          Created by <span className="font-bold">Fil Elman</span>
        </p>
        <p className="text-xs">
          This is a demo app for learning React and OpenWeatherMap API.
          No data is stored or transmitted outside of the browser.
        </p>
      </footer>
    </>
  );
}

export default App;