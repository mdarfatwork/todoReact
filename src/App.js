import React from 'react';
import Welcome from './components/welcome'
import Homepage from './components/homepage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Router basename="/">
          <Routes>
            <Route exact path="/" element={<Welcome/>} />
            <Route exact path="/todolist" element={<Homepage/>} />
          </Routes>
    </Router>
    </>
  );
}

export default App;