import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import "./setup.css";

function NodesAndEdges({ nodes, edges }) {
  return (
    <>
      {nodes.map((node, idx) => (
        <mesh key={idx} position={node.position.toArray()}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshBasicMaterial color="#4574cc" />
          <Html center>
            <div
              style={{ color: "white", fontWeight: "bold", userSelect: "none" }}
            >
              {node.name}
            </div>
          </Html>
        </mesh>
      ))}
      {edges.map((edge, idx) => (
        <Line
          key={idx}
          points={[edge.start.position, edge.end.position]}
          color={edge.selected ? "white" : "grey"}
          lineWidth={edge.selected ? 3 : 1}
        />
      ))}
    </>
  );
}

function GraphSetup() {
  const navigate = useNavigate();
  const location = useLocation();
  const algorithmFromState = location.state?.algorithm || "BFS";

  const [nodeCount, setNodeCount] = useState(4);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [algorithm, setAlgorithm] = useState(algorithmFromState);
  const requiresWeight = algorithm === "TSP";

  useEffect(() => {
    const newNodes = Array.from({ length: nodeCount }, (_, idx) => ({
      name: String.fromCharCode(65 + idx),
      position: new THREE.Vector3(
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2
      ),
    }));
    setNodes(newNodes);
  }, [nodeCount]);

  useEffect(() => {
    const allEdges = nodes.flatMap((node, i) =>
      nodes.slice(i + 1).map((otherNode) => ({
        start: node,
        end: otherNode,
        weight: 0,
        selected: false,
      }))
    );
    setEdges(allEdges);
  }, [nodes]);

  const handleEdgeSelect = (index) => {
    const updatedEdges = edges.map((edge, i) =>
      i === index ? { ...edge, selected: !edge.selected } : edge
    );
    setEdges(updatedEdges);
  };

  const handleNodeCountChange = (e) => {
    setNodeCount(e.target.value);
  };

  const completeSetup = () => {
    const selected = edges.filter((edge) => edge.selected);
    navigate("/scene", { state: { nodes, edges: selected, algorithm } });
  };

  return (
    <div className="setup-container">
      <h2 className="setup-header">Graph Setup</h2>
      <div className="setup-inputs">
        <label className="input-label">Number of Nodes:</label>
        <input
          className="setup-input"
          type="number"
          value={nodeCount}
          onChange={handleNodeCountChange}
          min="2"
        />
      </div>
      <Canvas>
        <ambientLight intensity={0.5} />
        <OrbitControls />
        <NodesAndEdges nodes={nodes} edges={edges} />
      </Canvas>
      {edges.map((edge, index) => (
        <div key={index}>
          <button
            className={`button ${edge.selected ? "button-selected" : ""}`}
            onClick={() => handleEdgeSelect(index)}
          >
            {edge.start.name}-{edge.end.name}{" "}
            {edge.selected ? "Selected" : "Select"}
          </button>
          {edge.selected && requiresWeight && (
            <input
              type="number"
              value={edge.weight}
              onChange={(e) => handleEdgeSelect(index, e.target.value)}
              min="1"
            />
          )}
        </div>
      ))}
      <button className="doneButton" onClick={completeSetup}>
        Complete Setup and Start Algorithm
      </button>
    </div>
  );
}

export default GraphSetup;
