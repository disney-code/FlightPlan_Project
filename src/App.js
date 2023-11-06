
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import FlightPlan from './components/FlightPlans';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<FlightPlan />}  />
      
      </Routes>
    </Router>
  );
}

export default App;
