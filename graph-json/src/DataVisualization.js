import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const DataVisualization = () => {
  const [files, setFiles] = useState(null);
  const [fileName, setFileName] = useState("");
  const svgRef = useRef(null);

  useEffect(() => {
    if (files) {
      const dataGraph = {
        IsError: false,
        IgnoreLocalCache: true,
        Data: files,
      };

      const nodes_t1 = [
        {
          id: dataGraph.Data[0]?.table_name,
          group: 20,
        },
      ];

      for (let i = 0; i < dataGraph.Data[0]?.column_name?.length; i++) {
        nodes_t1.push({
          id: dataGraph.Data[0]?.column_name[i],
          group: 7,
        });
      }

      const links_t1 = [];

      for (let i = 0; i < dataGraph.Data[0]?.column_name?.length; i++) {
        links_t1.push({
          source: dataGraph.Data[0]?.table_name,
          target: dataGraph.Data[0]?.column_name[i],
          value: 30,
        });
      }

      const dataForGraph = {
        nodes: nodes_t1,
        links: links_t1,
      };

      const simulation = d3
        .forceSimulation(dataForGraph.nodes)
        .force("link", d3.forceLink(dataForGraph.links).id((d) => d.id))
        .force("charge", d3.forceManyBody().strength(-100))
        .force("center", d3.forceCenter(300, 300));

      const svg = d3.select(svgRef.current);

      const link = svg
        .selectAll("line")
        .data(dataForGraph.links)
        .enter()
        .append("line")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
        .attr("stroke-width", (d) => Math.sqrt(d.value));

      const node = svg
        .selectAll("circle")
        .data(dataForGraph.nodes)
        .enter()
        .append("circle")
        .attr("r", 5)
        .attr("fill", (d) => getColor(d.group))
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      node.append("title").text((d) => d.id);

      simulation.on("tick", () => {
        link
          .attr("x1", (d) => d.source.x)
          .attr("y1", (d) => d.source.y)
          .attr("x2", (d) => d.target.x)
          .attr("y2", (d) => d.target.y);

        node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      });

      function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
      }

      function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      function getColor(group) {
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        return colorScale(group);
      }
    }
  }, [files]);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      const jsonContent = JSON.parse(e.target.result);
      const formattedContent = Object.keys(jsonContent).map((key) => ({
        table_name: key,
        column_name: [jsonContent[key]],
      }));
      setFiles(formattedContent);
      setFileName(file.name);
    };
  };

  const formattedContent = files
    ? Object.keys(files).map((key) => ({
        table_name: key,
        column_name: files[key],
      }))
    : [];

  return (
    <div>
      <h2>Data Visualization</h2>
      <input type="file" onChange={handleChange} />
      {fileName && <p>Selected File: {fileName}</p>}
      {formattedContent.length > 0 ? (
        <div>
          <h3>Graph</h3>
          <svg ref={svgRef} width="600" height="600"></svg>
        </div>
      ) : (
        <p>No data to display</p>
      )}
    </div>
  );
};

DataVisualization.propTypes = {
  files: PropTypes.array,
  fileName: PropTypes.string,
};

export default DataVisualization;
