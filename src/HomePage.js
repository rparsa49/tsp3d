import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css"; 

function HomePage() {
  let navigate = useNavigate();

  function handleAlgorithmSelection(algorithm) {
    console.log(algorithm)
    navigate("/setup", { state: { algorithm } });
  }

  return (
    <div className="home-page">
      <h1>Welcome to Vertex Voyager!</h1>
      <p>
        Vertex Voyager is an interactive learning tool designed to help you
        understand and visualize fundamental graph algorithms. Choose an
        algorithm below to see it in action and learn through visualization.
      </p>
      <div className="card-container">
        <div className="card">
          <h2>Breadth First Search</h2>
          <p>
            BFS explores the graph layer by layer, visiting neighbors before
            moving to the next level.
          </p>
          <button
            className="button"
            onClick={() => handleAlgorithmSelection("BFS")}
          >
            Explore BFS
          </button>
        </div>
        <div className="card">
          <h2>Depth First Search</h2>
          <p>
            DFS dives deeper into nodes, exploring as far as possible along each
            branch before backtracking.
          </p>
          <button
            className="button"
            onClick={() => handleAlgorithmSelection("DFS")}
          >
            Explore DFS
          </button>
        </div>
        <div className="card">
          <h2>Hamiltonian Tour</h2>
          <p>
            Seeks a path that visits each vertex once, forming a loop that
            returns to the starting vertex.
          </p>
          <button
            className="button"
            onClick={() => handleAlgorithmSelection("Hamiltonian")}
          >
            Explore Hamiltonian Tour
          </button>
        </div>
      </div>
      <footer className="homepage-footer">© Roya Parsa, 2024</footer>
    </div>
  );
}

export default HomePage;
