import React, { Component } from "react";
import Login from "./components/Login";
import Nav from "./components/Nav";
import Feed from "./components/Feed";
import styled from "styled-components";
import PuffLoader from "react-spinners/PuffLoader";
import { validateToken, getIp } from "./Utils";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: localStorage.getItem("travel4ever"),
      logged: undefined,
    };
  }

  async componentDidMount() {
    let token = this.state.token;
    if (token == null) {
      this.setState({ ...this.state, logged: false });
      return;
    }
    let ip = await getIp();
    let data = await validateToken(token, ip);
    data.active
      ? this.setState({ ...this.state, logged: true })
      : this.setState({ ...this.state, logged: false });
  }

  WhatToRender() {
    return this.state.logged ? <Nav display={<Feed />} /> : <Login />;
  }

  render() {
    const LoaderHolder = styled.div`
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      gap: 1em;
    `;

    const Spinner = styled(PuffLoader)`
      color: black;
      margin: 0;
    `;

    return this.state.logged === undefined ? (
      <LoaderHolder>
        <Spinner />
      </LoaderHolder>
    ) : (
      this.WhatToRender()
    );
  }
}

export default App;
