import React, { Component } from "react";
import styled from "styled-components";
import { MdDragIndicator } from "react-icons/md";

export default class Space extends Component {
  render() {
    //#region Styles
    const Article = styled.article`
      /* padding: 0.5em; */
      border-radius: 0 12px 12px 0;
      background-color: #eae3e3;
      margin-bottom: 0.5em;

      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 1em;
    `;

    const Title = styled.h3`
      display: inline;
    `;

    const DraggerHolder = styled.div`
      width: fit-content;
      height: 100%uto;
      padding: 1em 0.5em;

      background-color: burlywood;
    `;

    const Drag = styled(MdDragIndicator)`
      font-size: 1em;
    `;
    //#endregions

    return (
      <Article>
        <DraggerHolder>
          <Drag />
        </DraggerHolder>
        <Title>{this.props.title}</Title>
      </Article>
    );
  }
}
