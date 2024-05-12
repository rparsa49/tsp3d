import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {OrbitControls,PerspectiveCamera,Html, Line,} from "@react-three/drei";
import { useLocation, useNavigate } from "react-router-dom";
import { bfs, dfs, hamiltonianTour } from "./GraphAlgorithms";
import "./scene.css";

function Graph({ nodes, edges, highlightEdge, highlightNode }) {
  return (
    <>
      {nodes.map((node, index) => (
        <mesh
          key={index}
          position={[node.position.x, node.position.y, node.position.z]}
        >
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial
            color={highlightNode === node ? "#4574cc" : "#678ed6"}
          />
          <Html center>
            <div
              style={{ color: "white", fontWeight: "bold", userSelect: "none" }}
            >
              {node.name}
            </div>
          </Html>
        </mesh>
      ))}
      {edges.map((edge, index) => (
        <Line
          key={index}
          points={[
            [
              edge.start.position.x,
              edge.start.position.y,
              edge.start.position.z,
            ],
            [edge.end.position.x, edge.end.position.y, edge.end.position.z],
          ]}
          color={
            highlightEdge === edge ? "cyan" : edge.traversed ? "white" : "grey"
          }
          lineWidth={2}
        />
      ))}
    </>
  );
}

function Scene() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [highlightEdge, setHighlightEdge] = useState(null);
  const [highlightNode, setHighlightNode] = useState(null);
  const [algorithmSteps, setAlgorithmSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isDone, setDone] = useState(false);
  useEffect(() => {
    if (state?.nodes && state?.edges && state?.algorithm) {
    let steps;
    console.log(state.algorithm);
    switch (state.algorithm) {
      case "BFS":
        steps = bfs(state.nodes, state.edges, state.nodes[0]);
        break;
      case "DFS":
        steps = dfs(state.nodes, state.edges, state.nodes[0]);
        break;
      case "Hamiltonian":
        steps = hamiltonianTour(state.nodes, state.edges);
        break;
      default:
        steps = [];
    }
      setAlgorithmSteps(steps);
      setCurrentStepIndex(0);
    } else {
      console.error("Missing or incomplete data received from setup");
      navigate("/");
    }
  }, [state, navigate]);

  const nextStep = () => {
    if (currentStepIndex < algorithmSteps.length) {
      const step = algorithmSteps[currentStepIndex];
      if (step && step.edge) {
        step.edge.traversed = true; 
        setHighlightEdge(step.edge);
        setHighlightNode(step.node);
      } else {
        console.error("Invalid step or edge data:", step);
      }
      setCurrentStepIndex(currentStepIndex + 1);
    }
    if (currentStepIndex == algorithmSteps.length) {
          setDone(true);
    }
  };

  function HomeButton() {
    navigate("/");
  }

  return (
    <div className="scene-container">
      <Canvas className="scene-canvas">
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />
        <PerspectiveCamera makeDefault fov={50} position={[0, 0, 10]} />
        {state && (
          <Graph
            nodes={state.nodes}
            edges={state.edges}
            highlightEdge={highlightEdge}
            highlightNode={highlightNode}
          />
        )}
      </Canvas>
      <button className="scenebutton" onClick={nextStep}>
        Next Step
      </button>
      <button className="scenehome-button" onClick={HomeButton}>
        Home
      </button>
      {isDone && (
        <div className="done-footer">{state.algorithm} completed!</div>
      )}
    </div>
  );
}

export default Scene;
