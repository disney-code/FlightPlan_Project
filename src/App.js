
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/navigationBar';
import Login from './components/login';
import SignUp from './components/signup';
import About from './components/About';
import Map from './components/Map';
function App() {
  return (
    <Router>
      <Routes>
      <Route path="/map" element={<Map />}  />
        <Route path="/" element={<NavBar />}  />
        <Route path="/about" element={<About />}  />
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
