import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

function SearchForm({ onSearchSubmit }) {
    const [city, setCity] = useState('');

    const handleSearchChange = (e) => {
        setCity(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onSearchSubmit(city);
    };

    return (
        <form
            onClick={handleSearchSubmit}
            className="search-container">
            <input
                id="search-box"
                type="text"
                className="search-box"
                placeholder='Search for a city...'
                value={city}
                onChange={handleSearchChange}
                name="city" />
            <label htmlFor="search-box">
                <FontAwesomeIcon
                    className='search-icon'
                    icon={faMagnifyingGlass} />
            </label>
            <input
                type="submit"
                id="search-submit" />
        </form>
    )
}

export default SearchForm;