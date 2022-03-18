import React, { Component } from "react";
import styled from "styled-components";

class ButtonSecondary extends Component {
  render() {
    const Button = styled.button`
      padding: 0.6em 1em;
      background-color: transparent;
      color: black;
      font-size: 1.1em;
      border: 1px solid black;
      border-radius: 10px;
      font-weight: bold;
    `;

    return (
      <Button type="button" onClick={this.props.click}>
        {this.props.text}
      </Button>
    );
  }
}

export default ButtonSecondary;
