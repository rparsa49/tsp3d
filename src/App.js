import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import GraphSetup from "./GraphSetup";
import Scene from "./Scene";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<GraphSetup />} />
        <Route path="/scene" element={<Scene />} />
      </Routes>
    </Router>
  );
}

export default App;
