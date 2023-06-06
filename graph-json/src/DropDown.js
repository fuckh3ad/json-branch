import React, { Component } from "react";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", selectedContent: "" };
  }

  onChange(e) {
    const selectedValue = e.target.value;
    this.setState({ value: selectedValue });

    const { file } = this.props;
    if (file && file[selectedValue]) {
      this.setState({ selectedContent: file[selectedValue] });
    }
  }

  render() {
    const { file } = this.props;
    const { selectedContent } = this.state;

    return (
      <div className="form-group">
        <label htmlFor="select1">Table Name</label>
        <select
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          className="form-control"
        >
          {file &&
            Object.keys(file).map((key, index) => (
              <option key={index} value={key}>
                {key}
              </option>
            ))}
        </select>

        {selectedContent && (
          <div>
            <h3>Selected Content:</h3>
            <p>{selectedContent}</p>
          </div>
        )}
      </div>
    );
  }
}

export default DropDown;
