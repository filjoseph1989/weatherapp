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
      const response = await fetch( `/api/weather/${city}` );
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
      <h1 className='mb-4 text-3xl'>Weather App</h1>
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          id="city"
          name="city"
          value={city}
          onChange={handleSearchChange}
          placeholder="Search for a city..."
          className="w-[600px] rounded-md p-2 border border-gray-300 text-sm"
        />
        <button type="submit" className="p-2 text-white bg-blue-500 rounded-md">Search</button>
      </form>

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
          lat={selectedLat}
          lon={selectedLon} />
      )}
    </div>
  );
}

export default App;