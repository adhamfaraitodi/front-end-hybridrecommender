import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import RecipeDetail from './components/RecipeDetail';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
