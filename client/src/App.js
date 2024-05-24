import './App.css';
import Weather from './components/Weather';
import React, { useState, useEffect } from 'react';


function App() {
  const [city, setCity] = useState(''); // City entered by user
  const [searchResults, setSearchResults] = useState([]); // Array of search results
  const [selectedCity, setSelectedCity] = useState(null); // Selected city object

  const handleSearchChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    if (!city) {
      alert('Please enter a city name to search.');
      return;
    }

    try {
      const response = await fetch( `/weather/${city}` );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      alert('An error occurred while searching for the city. Please try again.');
    }
  };

  const handleCitySelect = (cityObject) => {
    setSelectedCity(cityObject);
    setCity(''); // Clear the search input after selection
    setSearchResults([]); // Clear search results after selection
  };

  const [selectedLat, setSelectedLat] = useState(null);
  const [selectedLon, setSelectedLon] = useState(null);

  useEffect(() => {
    // Fetch weather data only when selectedCity changes
    if (selectedCity) {
      const { lat, lon } = selectedCity;
      setSelectedLat(lat);
      setSelectedLon(lon);
    }
  }, [selectedCity]);

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSearchSubmit}>
        <label htmlFor="city">Enter city name:</label>
        <input
          type="text"
          id="city"
          name="city"
          value={city}
          onChange={handleSearchChange}
          placeholder="Search for a city..."
        />
        <button type="submit">Search</button>
      </form>

      {searchResults && (
        <ul>
          {Object.values(searchResults).map((cityObject) => (
            <li key={`${cityObject.name}-${cityObject.country}`} style={{backgroundColor: 'bisque'}}>
              {cityObject.name}, {cityObject.country}
              <button style={{ marginLeft: '10px' }} onClick={() => handleCitySelect(cityObject)}>
                Select
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedCity && (
        <Weather
          lat={selectedLat}
          lon={selectedLon} />
      )}
    </div>
  );
}

export default App;