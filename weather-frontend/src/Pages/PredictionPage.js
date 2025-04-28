import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';

function PredictionPage() {
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
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={6} sx={{ p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Weather Prediction 🌦️
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Max Temperature"
            variant="outlined"
            name="temp_max"
            value={formData.temp_max}
            onChange={handleChange}
            required
          />
          <TextField
            label="Min Temperature"
            variant="outlined"
            name="temp_min"
            value={formData.temp_min}
            onChange={handleChange}
            required
          />
          <TextField
            label="Precipitation"
            variant="outlined"
            name="precipitation"
            value={formData.precipitation}
            onChange={handleChange}
            required
          />
          <TextField
            label="Wind Speed"
            variant="outlined"
            name="wind"
            value={formData.wind}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary" size="large">
            Predict
          </Button>
        </Box>

        {prediction !== null && (
          <Typography variant="h5" align="center" sx={{ mt: 4 }}>
            Prediction: {prediction}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}

export default PredictionPage;
