import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  publicofuser,
  getuser,
  edituser,
  getItinerary,
  getSiteById,
} from "../Utils";
import { Link } from "react-router-dom";
import styled from "styled-components";
import ItinerarySmallShow from "./ItinerarySmallShow";

export default function Itinerarys() {
  const [owner, setOwner] = useState("");
  const [me, setMe] = useState("");
  const [editing, setEditing] = useState(false);
  const [itinerary, setItinerary] = useState("");

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const params = useParams();
  const query = useQuery();

  if (!editing && query.get("edit") !== null) setEditing(true);
  console.log(editing);

  useEffect(() => {
    (async () => {
      if (owner === "") {
        let res = await publicofuser(params.user);
        setOwner(res);
      }

      setMe(await getuser());

      if (itinerary === "") {
        setItinerary(await getItinerary(params.user, params.itinerary));
      }

      console.log(itinerary);

      if (itinerary !== "") {
        document.title = `
          ${itinerary.title[0].toUpperCase()}${itinerary.title.slice(1)}
          - Travel4Ever
        `;
      }
    })();
  }, [params, owner, itinerary, setItinerary]);

  console.log();

  //#region Styles
  const Title = styled.h1`
    /* padding: 1em 0 0.5em 1em; */
    width: 100%;
    text-align: center;
    margin-top: 2em;
  `;

  const Separator = styled.hr`
    margin: 0 1em 0.5em 1em;
    color: black;
  `;

  const Center = styled.div`
    width: 50%;
    margin: 0 auto;

    display: flex;
    flex-direction: column;
    gap: 1em;

    @media (max-width: 900px) {
      width: 60%;
    }

    @media (max-width: 650px) {
      width: 70%;
    }

    @media (max-width: 500px) {
      width: 80%;
    }
  `;

  const Itinerarys = styled.div`
    border: 1px solid gray;
    border-radius: 5px;
    width: 100%;
  `;

  const By = styled.p`
    color: gray;
    cursor: pointer;
    font-size: 1.1em;
    text-decoration: underline;
    width: fit-content;
  `;

  const NotFound = styled.h2`
    text-align: center;
    margin-top: 2em;
  `;
  //#endregion

  return itinerary !== "404" ? (
    <section>
      <Center>
        <Title>{itinerary === "" ? "" : itinerary.title}</Title>
        <Separator />
        <Itinerarys>
          {itinerary === ""
            ? ""
            : itinerary.places.map((place, index) => {
                return (
                  <ItinerarySmallShow
                    id={place.id}
                    index={index}
                    title={place.title}
                  />
                );
              })}
        </Itinerarys>
        <By
          onClick={() => (window.location = `/profile/${owner.username}`)}
        >{`Por: ${owner.username}`}</By>
      </Center>
    </section>
  ) : (
    <NotFound>404</NotFound>
  );
}
