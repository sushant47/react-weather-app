import React, { useEffect, useState } from "react";

function WeatherApp() {
  const [cityList, setCityList] = useState<any[]>([]);
  const [city, setCity] = useState("");
  interface WeatherData {
    current_weather?: {
      temperature: number;
      windspeed: number;
    };
    hourly_units?: {
      temperature_2m: string;
      windspeed_10m: string;
    };
    error?: string;
  }

  useEffect(() => {
    // Fetch the list of cities from the API
    const fetchCities = async () => {
      try {
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/population/cities"
        );
        const data = await response.json();
        console.log(data);
        setCityList(data.data.map((city: any) => city.city));
      } catch (error) {
        console.error("Failed to fetch city list:", error);
      }
    };

    fetchCities();
  }, []);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  const handleCityChange = (event: any) => {
    setCity(event.target.value);
  };

  const fetchWeatherData = async () => {
    try {
      // Geocoding API to get coordinates from city name (replace with a more robust solution if needed)
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
      );
      const geocodingData = await geocodingResponse.json();

      if (geocodingData.results && geocodingData.results.length > 0) {
        const { latitude, longitude } = geocodingData.results[0];

        // Fetch weather data using the coordinates
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        const data = await weatherResponse.json();
        setWeatherData(data);
      } else {
        setWeatherData({ error: "City not found" });
      }
    } catch (error) {
      setWeatherData({ error: "Failed to fetch data" });
    }
  };

  // interface Item {
  //   city: string;
  // }

  // interface ItemListProps {
  //   items: Item[];
  // }

  const ItemList: React.FC<any> = ({ items }) => {
    if (!items || items.length === 0) {
      return <span>No items available</span>;
    }
    return (
      <ul>
        {items.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div>
        <h1>List of Items</h1>
        {/* Example usage: pass an array of items if you want to use ItemList */}
        {/* <ItemList items={cityList} /> */}
        <select id="my-dropdown" value={city} onChange={handleCityChange}>
          <option value="" disabled>
            Select one
          </option>
          {cityList.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      {/* <input type="select" value={city} onChange={handleCityChange} /> */}
      <button onClick={fetchWeatherData}>Get Weather</button>

      {weatherData && weatherData.error && <span>{weatherData.error}</span>}

      {weatherData && weatherData.current_weather && (
        <>
          <span>
            Temperature: {weatherData.current_weather.temperature}{" "}
            {weatherData.hourly_units?.temperature_2m || ""}
          </span>

          <span>
            Wind Speed: {weatherData.current_weather.windspeed}{" "}
            {weatherData.hourly_units?.windspeed_10m || ""}
          </span>
        </>
      )}
    </>
  );
}

export default WeatherApp;
