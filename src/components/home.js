import React from "react";
import TextField from "@material-ui/core/TextField";
import { Redirect } from "react-router-dom";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toVote: false,
      inputValue: ""
    };
  }

  _handleKeyPress = e => {
    if (e.key === "Enter") {
      this.setState({
        toVote: true
      });
    }
  };

  _handleTextChange = e => {
    console.log(e.target.value);
    this.setState({
      inputValue: e.target.value
    });
  };

  render() {
    if (this.state.toVote === true) {
      return <Redirect to={`/${this.state.inputValue}`} />;
    }
    return (
      <div className="Home" style={{ margin: 8, padding: 8 }}>
        <TextField
          onKeyPress={this._handleKeyPress}
          onChange={this._handleTextChange}
          id="outlined-full-width"
          label="ID"
          style={{ margin: 0, padding: 0 }}
          placeholder="1234"
          helperText="Type the ID then press <ENTER>"
          fullWidth
          margin="normal"
          variant="outlined"
          InputLabelProps={{
            shrink: true
          }}
        />
      </div>
    );
  }
}

export { Home };
