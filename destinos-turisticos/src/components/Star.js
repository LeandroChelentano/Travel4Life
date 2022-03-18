import React from "react";
import { MdOutlineStarPurple500 } from "react-icons/md";
import styled from "styled-components";

export default function Star(props) {
  //#region Styled
  const Icon = styled(MdOutlineStarPurple500)`
    color: ${props.checked ? "gold" : "black"};
  `;

  //#endregion

  return <Icon />;
}
