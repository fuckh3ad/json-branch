import React, { Component } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";
import select from "d3-selection";
import ForceGraph2D from "react-force-graph-two-dim-only";
// import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph'
// I don't have enough internal storage in my Sandbox Editor :(

// try recreating the d3 graph using react-force-graph

const dataGraph = {
  IsError: false,
  IgnoreLocalCache: true,
  Data: [
    {
      table_name: "dim_Contact",
      column_name: [
        "MMKTSendNotificationNewWebUser",
        "MMKTNonWebUser",
        "LockedOutOfWeb",
        "EmailPreferenceURL",
        "PositionLevel",
        "wk_Institution",
        "fk_CurrentInstitution"
      ]
    },
    {
      table_name: "dim_Institution",
      column_name: [
        "fk_CurrentInstitution",
        "InitiativePilot",
        "InferredMember",
        "SourceID",
        "PositionLevel",
        "wk_Institution"
      ]
    },
    {
      table_name: "dim_ActivityType",
      column_name: [
        "EffectiveDate",
        "ExpirationDate",
        "PositionLevel",
        "wk_Institution",
        "fk_CurrentInstitution"
      ]
    }
  ]
};

//////////////////////////////////////////////////////////////////////////

// Initializing node graph for table dim_Contact
// const nodes_t1 = [];
// nodes_t1.push({
//   id: dataGraph.Data[0].table_name,
//   group: 10
// });

// for (let i = 0; i < dataGraph.Data[0].column_name.length; i++) {
//   nodes_t1.push({
//     id: dataGraph.Data[0].column_name[i],
//     group: 7
//   });
// }

const nodes_t1 = [
  {
    id: dataGraph.Data[0].table_name,
    group: 20
  }
];

for (let i = 0; i < dataGraph.Data[0].column_name.length; i++) {
  nodes_t1.push({
    id: dataGraph.Data[0].column_name[i],
    group: 7
  });
}

// Initializing link graph for table dim_Contact
const links_t1 = [];

for (let i = 0; i < dataGraph.Data[0].column_name.length; i++) {
  links_t1.push({
    source: dataGraph.Data[0].table_name,
    target: dataGraph.Data[0].column_name[i],
    value: 30
  });
}

const dataForGraph = {
  nodes: nodes_t1,
  links: links_t1
};

/////////////////////////////////////////////////////////////////////////

// Initializaing node graph for table dim_Institution
const nodes_t2 = [];
nodes_t2.push({
  id: dataGraph.Data[1].table_name
});

for (let i = 0; i < dataGraph.Data[1].column_name.length; i++) {
  nodes_t2.push({
    id: dataGraph.Data[1].column_name[i]
  });
}

// Initializing link graph for table dim_Institution
const links_t2 = [];

for (let i = 0; i < dataGraph.Data[1].column_name.length; i++) {
  links_t2.push({
    source: dataGraph.Data[1].table_name,
    target: dataGraph.Data[1].column_name[i],
    value: 23
  });
}

/////////////////////////////////////////////////////////////////////////

// Initializing node graph for table dim_ActivityType
const nodes_t3 = [];
nodes_t3.push({
  id: dataGraph.Data[2].table_name
});

for (let i = 0; i < dataGraph.Data[2].column_name.length; i++) {
  nodes_t3.push({
    id: dataGraph.Data[2].column_name[i]
  });
}

// Initializing link graph for table dim_ActivityType
const links_t3 = [];

for (let i = 0; i < dataGraph.Data[2].column_name.length; i++) {
  links_t3.push({
    source: dataGraph.Data[2].table_name,
    target: dataGraph.Data[2].column_name[i],
    value: 23
  });
}

/////////////////////////////////////////////////////////////////////////

// Child class
// Have a state here that passes the data
class NodeGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nodes: nodes_t1,
      links: links_t1,
      data: dataForGraph
    };

    // this.handleClick = this.handleClick.bind(this);
  }

  // componentDidMount() {
  //   this.createGraph();
  // }

  // handleClick() {}

  componentDidMount() {
    // this.handleClick();
    // this.handleClick();
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
      .force("charge", d3.forceManyBody().strength(-900)) // evenly spreads the column_names around the table_name
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

    // Creating nodes
    const node = svg
      .selectAll(".node")
      .data(this.state.nodes)
      .enter()
      .append("g")
      // .on("click", handleClick())
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
      })

      .on("click", function (d) {
        // if (d.id !== "dim_Contact") {
        //   //console.log(d);
        //   //console.log("This is a column node!");
        //   // Write code here to append table nodes to a particular column node
        //   //console.log(nodes_t2);
        // }

        // if (d.id === "dim_Contact") {
        //   console.log(d);
        //   console.log("This is a table node!");
        // }

        if (d.id === "wk_Institution") {
          // console.log(d);
          // Call an update function here
          // add the dim_Institution and dim_ActivityType nodes to this node
          const circle = svg.select("g").selectAll("circle").data({
            id: dataGraph.Data[1].table_name,
            group: 10
          });

          circle.enter().append("circle").attr("r", 0);

          console.log(circle);
          console.log(d);
        }
      });

    simulation.nodes(this.state.nodes).on("tick", ticked);
    simulation.force("link").links(this.state.links);

    ////////////////////////////////// D3 CODE /////////////////////////////////////////
  }

  render() {
    return (
      <div>
        <svg width={630} height={590} />
      </div>
    );
  }
}

// Parent class
class DataVisualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      selectedOption: ""
    };
  }

  componentDidMount() {
    // dataGraph is declared and initialized globally
    // You want to fetch data from API over here
    // Example: dataGraph = GET(API_URL)
    // dataGraph is a JSON object

    // temp is the iterator
    let tempData = dataGraph.Data.map((temp) => {
      return { value: temp };
    });

    // console.log(tempData);
    // console.log(Object.keys(tempData));
    // console.log(Object.values(tempData));

    // console.log(tempData[0].value);
    // console.log(tempData[0].value.table_name);

    this.setState({ data: tempData });
  }

  update = (e) => {
    this.setState({ selectedOption: e.target.value });
  };

  render() {
    return (
      <div>
        <div className="form-group">
          <label htmlFor="select1">Table Name</label>
          <div id="DropDownSelection">
            <select
              value={this.state.selectedOption}
              onChange={this.update.bind(this)}
              className="form-control"
            >
              {this.state.data.map((temp) => (
                <option
                  key={temp.value.table_name}
                  value={temp.value.table_name}
                >
                  {temp.value.table_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <NodeGraph />
          </div>
        </div>
      </div>
    );
  }
}

DataVisualization.propTypes = {};
export default DataVisualization;
