import React from "react";
import ReactDOM from "react-dom";
import DV from "./DataVisualization.js";


import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>DataVisualization App for Gartner's</h1>
      <DV />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
