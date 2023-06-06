import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import select from "d3-selection";

class DatabaseVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterObject: {},
      nodes: [],
      links: [],
      svgHeight: 590,
      svgWidth: 670
    };
  }

  componentDidMount() {
    let windowHeight = window.innerHeight;
    let windowWidth = window.innerWidth;
    this.setState({
      svgHeight: windowHeight - 600,
      svgWidth: windowWidth - 400
    });
  }

  componentDidUpdate(prevProps) {
    console.log(prevProps);
    console.log(this.props.filteredData);

    if (prevProps.filteredData !== this.props.filteredData) {
      // console.log(prevProps);
      // console.log(this.props.filteredData);
      let windowHeight = window.innerHeight;
      let windowWidth = window.innerWidth;
      this.setState({
        svgHeight: windowHeight - 100,
        svgWidth: windowWidth - 50
      });
      this.setState({ nodes: [], links: [] });
      let svg = d3.select("svg");
      svg.selectAll("*").remove();
      if (this.props.filteredData.length !== 0) {
        // console.log(prevProps);
        // console.log(this.props.filteredData);

        // Initializing nodes and links from filteredData
        let dataGraph = this.props.filteredData;
        const nodes_t1 = [
          {
            id: dataGraph[0].table_name,
            group: 10
          }
        ];

        dataGraph.map((row) => {
          nodes_t1.push({
            id: row.column_name,
            group: 7
          });
        });

        // console.log(nodes_t1);

        const links_t1 = [];
        dataGraph.map((row) => {
          links_t1.push({
            source: row.table_name,
            target: row.column_name,
            value: 30
          });
        });

        // console.log(links_t1);

        this.setState(
          {
            nodes: nodes_t1,
            links: links_t1
          },
          function () {
            this.createGraph();
          }
        );
      }
    }
  }

  createGraph() {
    /////////////////////////////////// D3 CODE /////////////////////////////////////////

    const svg = d3.select("svg");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const color = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);

    // Initializing force simulation
    const simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3
          .forceLink()
          .id((d) => {
            return d.id;
          })
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-1000)) // evenly spreads the column_names around the table_name
      .force("center", d3.forceCenter(width / 2, height / 2)); // positions nodes in the center of the svg element

    // Functions regarding ticked and drag
    const ticked = () => {
      link
        .attr("x1", (d) => {
          return d.source.x;
        })
        .attr("y1", (d) => {
          return d.source.y;
        })
        .attr("x2", (d) => {
          return d.target.x;
        })
        .attr("y2", (d) => {
          return d.target.y;
        });

      node.attr("transform", (d) => {
        return "translate(" + d.x + "," + d.y + ")";
      });
    };

    const dragstarted = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (d) => {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    };

    const dragended = (d) => {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    console.log(this.state.links);

    // Creating links
    const link = svg
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(this.state.links)
      .enter()
      .append("line")
      .attr("stroke-width", (d) => {
        return Math.sqrt(d.value);
      })
      .style("opacity", "0.25");

    console.log(this.state.nodes);

    // Creating nodes
    const node = svg
      .selectAll(".node")
      .data(this.state.nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .call(
        d3
          .drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Circle node
    node
      .append("circle")
      .attr("r", 21)
      .style("opacity", "0.79")
      // .style("filter", "opacity(30%)")
      .style("fill", (d) => {
        return color(d.group);
      });

    // Circle text
    node
      .append("text")
      .attr("text-anchor", "middle")
      .style("font-size", 10)
      .style("font-weight", "bold")
      .style("font-family", "Arial")
      .style("font-stretch", "condensed")
      .attr("transform", "translate(0,35)")
      .text((d) => {
        return d.id;
      });

    node
      .on("mouseover", function (d) {
        d3.select(this)
          .select("text")
          .transition()
          .duration(200)
          .style("font-size", 18)
          .attr("transform", "translate(0,44)");

        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 27);
      })

      .on("mouseout", function (d) {
        d3.select(this)
          .select("text")
          .transition()
          .duration(200)
          .style("font-size", 10)
          .attr("transform", "translate(0,35)");

        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 21);
      });

    simulation.nodes(this.state.nodes).on("tick", ticked);
    simulation.force("link").links(this.state.links);

    ////////////////////////////////// D3 CODE /////////////////////////////////////////
  }
  handleTableSelectedIndexChange(option) {
    //    //console.log(option);
    //    //let selected = this.refs.tableOption.option;
    //    //console.log(selected);
    //    //e.preventDefault();
  }

  handleSubmit(e) {
    //console.log(this.refs.tableOption.value);
    this.setState(
      {
        filterObject: {
          filterColumn: "table_name",
          filterText: this.refs.tableOption.value
        }
      },
      function () {
        this.props.filterData(this.state.filterObject);
      }
    );
    e.preventDefault();
  }

  render() {
    //console.log(this.props.filteredData);
    let options = [];
    if (this.props.dbdata) {
      const unique = [
        ...new Set(this.props.dbdata.map((items) => items.table_name))
      ];
      //console.log(unique);
      unique.map((item) => {
        if (item !== null || item !== "") {
          options.push({ label: item, value: item });
        }
      });
    }
    let tableOptions = options.map((option) => {
      return (
        <option key={option.label} value={option.value}>
          {option.value}
        </option>
      );
    });
    return (
      <div className="impact-graph-container">
        <form className="graph-form" onSubmit={this.handleSubmit.bind(this)}>
          <div className="filter-graph-container">
            <select
              id="table-select"
              className="filter-drop-down tables-drop-down"
              onChange={this.handleTableSelectedIndexChange.bind(this)}
              ref="tableOption"
              placeholder="Select Table"
            >
              <option defaultValue="default" value="default">
                Select Table
              </option>
              {tableOptions}
            </select>
            <button
              className="btn waves-effect waves-light"
              type="submit"
              value="Submit"
            >
              Update Graph
              <i className="material-icons left">refresh</i>
            </button>
          </div>
          <svg
            className="node-graph-container"
            width={this.state.svgWidth}
            height={this.state.svgHeight}
          />
        </form>
      </div>
    );
  }
}

DatabaseVisualization.propTypes = {};

export default DatabaseVisualization;
