import React, { Component } from "react";

class ButtonPrimary extends Component {
  render() {
    const btn = {
      padding: "0.7em 1.3em",
      backgroundColor: "blue",
      color: "white",
      fontSize: "1.3em",
      border: "0",
      borderRadius: "10px",
      fontWeight: "bolder",
      // margin: "0.8em 0 0 0",
    };

    return (
      <button style={btn} type="button" onClick={this.props.click}>
        {this.props.text}
      </button>
    );
  }
}

export default ButtonPrimary;
