import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PredictionPage from './Pages/PredictionPage';
import AnalysisPage from './Pages/AnalysisPage';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav>
          <Link to="/">Prediction</Link> | {" "}
          <Link to="/analysis">Weather Analysis</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PredictionPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
