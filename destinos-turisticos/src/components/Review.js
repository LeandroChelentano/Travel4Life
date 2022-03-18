import React, { useEffect, useState } from "react";
import { MdFaceUnlock } from "react-icons/md";
import styled from "styled-components";
import Star from "./Star";
import { getuser, deleteReview } from "../Utils";

export default function Review(props) {
  const [stars, setStars] = useState([]);
  const [me, setMe] = useState("");

  useEffect(() => {
    if (stars.length === 0) {
      let temp = new Array(5);
      for (let i = 0; i < temp.length; i++) {
        i < props.calification ? (temp[i] = true) : (temp[i] = false);
      }
      setStars(temp);
    }

    (async () => {
      if (me === "") {
        setMe(await getuser());
      }
    })();
  }, [props.calification, stars, me]);

  const handleDeleteReview = async () => {
    const placeId = props.siteId;
    const data = await deleteReview(placeId);

    window.location.reload(false);
    console.log(data);
  };

  // #region Styles
  const Holder = styled.div`
    padding: 0.5em 1em;
    /* margin: 1em; */

    width: fit-content;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    gap: 1em;
  `;

  const Photo = styled(MdFaceUnlock)`
    font-size: 2.5em;
  `;

  const StarHolder = styled.div``;

  const Title = styled.h2`
    display: inline;
  `;

  const Description = styled.p``;

  const Text = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.4em; ;
  `;

  const Delete = styled.p`
    width: fit-content;
    text-decoration: underline;
    cursor: pointer;
  `;

  const By = styled.p`
    color: grey;
    width: fit-content;
    text-decoration: underline;
    cursor: pointer;
  `;

  const Top = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
  `;
  //#endregion

  return (
    <Holder key={props.id}>
      <Photo />
      <Text>
        <Top>
          <Title>{props.title}</Title>
          <Delete onClick={() => handleDeleteReview()}>Delete</Delete>
        </Top>
        <div>
          {stars.map((star) => {
            return <Star checked={star} />;
          })}
        </div>
        <hr />
        <Description>{props.description}</Description>
        <By
          onClick={() => (window.location = `/profile/${props.author}`)}
        >{`Por: ${props.author}.`}</By>
      </Text>
    </Holder>
  );
}
