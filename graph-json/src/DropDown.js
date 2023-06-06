// Don't worry about this file

// Child class
class DropDown extends Component {
    constructor(props) {
      super(props);
      this.state = { value: "First" };
    }
    onChange(e) {
      this.setState({
        value: e.target.value
      });
    }
    render() {
      return (
        <div className="form-group">
          <label htmlFor="select1">Table Name</label>
          <select
            value={this.state.value}
            onChange={this.onChange.bind(this)}
            className="form-control"
          >
            <option value="First">dim_Contact</option>
            <option value="Second">dim_Institution</option>
            <option value="Third">dim_ActivityType</option>
          </select>
        </div>
      );
    }
  }
  