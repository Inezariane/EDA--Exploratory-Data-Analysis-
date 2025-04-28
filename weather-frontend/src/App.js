import React, { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    temp_max: '',
    temp_min: '',
    precipitation: '',
    wind: ''
  });
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        temp_max: parseFloat(formData.temp_max),
        temp_min: parseFloat(formData.temp_min),
        precipitation: parseFloat(formData.precipitation),
        wind: parseFloat(formData.wind)
      })
    });
    const result = await response.json();
    setPrediction(result.prediction[0]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Weather Prediction 🌦️</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="temp_max" placeholder="Max Temperature" value={formData.temp_max} onChange={handleChange} required /><br /><br />
        <input type="text" name="temp_min" placeholder="Min Temperature" value={formData.temp_min} onChange={handleChange} required /><br /><br />
        <input type="text" name="precipitation" placeholder="Precipitation" value={formData.precipitation} onChange={handleChange} required /><br /><br />
        <input type="text" name="wind" placeholder="Wind Speed" value={formData.wind} onChange={handleChange} required /><br /><br />
        <button type="submit">Predict</button>
      </form>

      {prediction !== null && (
        <h2>Prediction: {prediction} </h2>
      )}
    </div>
  );
}

export default App;
