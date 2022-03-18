import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function FeedResult(props) {
  const navigate = useNavigate();

  //#region Styles
  const Article = styled.article`
    display: flex;
    flex-direction: column;
    gap: 0.2em;
    padding: 1em;

    border-top: ${props.index === 0 ? "1px solid lightgray" : "0"};
    border-bottom: 1px solid lightgray;
  `;

  const Titulo = styled.h2`
    width: fit-content;
    cursor: pointer;
    font-weight: normal;

    &:hover {
      text-decoration: underline;
    }
  `;

  const Desc = styled.p``;

  const Author = styled.p`
    color: gray;
  `;
  //#endregion

  return (
    <Article>
      <Titulo
        onClick={() =>
          props.type === "Sitio"
            ? navigate(`/profile/${props.author}/sites/${props.title}`)
            : navigate(`/profile/${props.author}/itinerarys/${props.title}`)
        }
      >
        {props.title}
      </Titulo>
      <Author>{`~ ${props.type} por ${props.author}`}</Author>
      <Desc>{props.description}</Desc>
    </Article>
  );
}
