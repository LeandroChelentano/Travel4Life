import React, { useState } from "react";
import styled from "styled-components";
import Itinerary from "./Itinerary";
import uuid from "react-uuid";
import { getitinerarysfromuser, getuser } from "../Utils";
import { useEffect } from "react/cjs/react.development";
import { useParams } from "react-router-dom";

function MisSitios() {
  let [owner, setOwner] = useState("");
  let [me, setMe] = useState("");
  let [itinerarys, setItinerarys] = useState([]);

  let params = useParams();

  useEffect(() => {
    setOwner(params.user);
    (async () => {
      if (owner !== "") setItinerarys(await getitinerarysfromuser(owner));

      setMe(await getuser());

      document.title =
        me === owner
          ? "Mis Sitios - Travel4Ever"
          : `Sitios de ${owner[0].toUpperCase()}${owner.slice(
              1
            )} - Travel4Ever`;
    })();
  }, [params.user, owner, me]);

  //#region Styles
  const SitesHolder = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
  `;
  //#endregion

  return (
    <section key={uuid()}>
      <SitesHolder key={uuid()} id="SitesHolder">
        {itinerarys.map((itinerary) => {
          return (
            <Itinerary
              key={uuid()}
              title={itinerary.title}
              author={itinerary.owner}
            />
          );
        })}
      </SitesHolder>
    </section>
  );
}

export default MisSitios;
