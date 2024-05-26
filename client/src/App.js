import './App.css';
import Weather from './components/Weather';
import React, { useState } from 'react';
import SearchForm from './components/SearchForm';
import { endpoints } from './config/endpoints';
import { Navigate } from 'react-router-dom';

function App() {
  const [searchResults, setSearchResults] = useState([]); // Array of search results
  const [selectedCity, setSelectedCity] = useState(null); // Selected city object
  const [toMap, setToMap] = useState(false);

  const handleSearchSubmit = async (city) => {
    if (!city) {
      alert('Please enter a city name to search.');
      return;
    }

    try {
      const response = await fetch(`${endpoints.API_WEATHER_BY_CITY}/${city}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('An error occurred while searching for the city. Please try again.');
    }
  };

  const handleCitySelect = (cityObject) => {
    setSelectedCity(cityObject);
    setSearchResults([]); // Clear search results after selection
  };

  const handleGoToMap = () => {
    setToMap(true);
  };

  if (toMap) {
    return <Navigate to="/map" replace={true} />
  }

  return (
    <div className="App">
      <h1 className='mb-4 text-3xl'>Weather App</h1>
      <SearchForm
        onSearchSubmit={handleSearchSubmit}
        onGoToMap={handleGoToMap} />

      {searchResults && (
        <ul className="flex flex-col space-y-2 mb-4">
          {Object.values(searchResults).map((cityObject) => (
            <li key={`${cityObject.name}-${cityObject.country}`}
              className="flex items-center border rounded p-2">
              <span className="flex-1">{cityObject.name}, {cityObject.country}</span>
              <button className="" onClick={() => handleCitySelect(cityObject)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCity && (
        <Weather
          selectedCity={selectedCity} />
      )}
    </div>
  );
}

export default App;