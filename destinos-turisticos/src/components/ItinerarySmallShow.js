import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getSiteById } from "../Utils";

export default function ItinerarySmallShow(props) {
  const [owner, setOwner] = useState("");

  useEffect(() => {
    (async () => {
      if (owner === "") {
        setOwner(await getSiteById(props.id));
      }
    })();
  }, [props.id, owner]);

  //#region Styled
  const Article = styled.article`
    padding: 0.5em;
    margin: 0.5em;
    border: 1px solid gray;
    border-radius: 5px;
    /* width: 100%; */
  `;

  const Title = styled.h3`
    font-weight: normal;
  `;
  //#endregion

  return (
    <Article>
      <Title
        onClick={() =>
          (window.location = `/profile/${owner}/sites/${props.title}`)
        }
      >{`${props.index + 1}. ${props.title}`}</Title>
    </Article>
  );
}
