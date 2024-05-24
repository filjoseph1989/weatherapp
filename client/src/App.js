import './App.css';
import Weather from './components/Weather';

function App() {
  const lat = 37.7749;
  const lon = -122.4194;

  return (
    <div>
      <h1>Weather App</h1>
      <Weather lat={lat} lon={lon} />
    </div>
  );
}

export default App;
