import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import DV from "./DataVisualization.js";
import { Upload } from "./Upload.jsx";


import "./styles.css";

function App() {
  return (
    <div className="App">
      <h1>DataVisualization App for Gartner's</h1>
      <DV />
      <Upload>
        <button>Upload Files</button>
      </Upload>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
