import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function WeatherApp() {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('');
    const [error, setError] = useState('');

    const fetchWeather = async (searchLocation) => {
        const apiKey = process.env.REACT_APP_WEATHER_API;
        const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${searchLocation}&limit=1&appid=${apiKey}`;
        
        try {
            const geoResponse = await axios.get(geocodeUrl);

            if (geoResponse.data.length === 0) {
                throw new Error('City not found. Please try again.');
            }

            const { lat, lon } = geoResponse.data[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            const weatherResponse = await axios.get(weatherUrl);
            setWeather(weatherResponse.data);
            setError('');
        } catch (err) {
            setError(err.message || 'An unexpected error occurred.');
            setWeather(null);
        }
    };

    useEffect(() => {
        // Load default city weather when app loads
        fetchWeather('Kinshasa');
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!city.trim()) {
            setError('Please enter a city name.');
            return;
        }
        fetchWeather(city.trim());
    };

    return (
        <div className="container">
            <div className="weather-card">
                <h1 className="title">Lina Weather App</h1>
                <img
                    className="weather-icon"
                    src="https://cdn-icons-png.flaticon.com/512/1779/1779940.png"
                    alt="Weather Icon"
                />
                <p className="subtitle">Find Weather of a City</p>

                <form onSubmit={handleSearch} className="search-bar">
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city name"
                    />
                    <button type="submit">Search</button>
                </form>

                {error && <p className="error">{error}</p>}

                {weather && (
                    <div className="weather-info">
                        <h2>{weather.name}</h2>
                        <p>{weather.weather[0].description}</p>
                        <p>
                            <strong>{weather.main.temp} °C</strong>
                        </p>
                        <p>Humidity: {weather.main.humidity}%</p>
                        <p>Wind Speed: {weather.wind.speed} m/s</p>
                    </div>
                )}
            </div>
        </div>
    );
}
