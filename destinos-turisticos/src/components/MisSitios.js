import React, { useState } from "react";
import styled from "styled-components";
import Site from "./Site";
import uuid from "react-uuid";
import { getSites, getuser } from "../Utils";
import { useEffect } from "react/cjs/react.development";
import { useParams } from "react-router-dom";

function MisSitios() {
  let [owner, setOwner] = useState("");
  let [me, setMe] = useState("");
  let [places, setPlaces] = useState([]);

  let params = useParams();

  useEffect(() => {
    setOwner(params.user);
    (async () => {
      if (owner !== "") setPlaces(await getSites(owner));

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
        {places.map((place) => {
          return (
            <Site
              key={uuid()}
              id={place.id}
              name={place.name}
              description={
                place.description.length > 100
                  ? `${place.description.slice(0, 110)}...`
                  : place.description
              }
              photo={place.photos[0] || ""}
              date={new Date(place.time)}
              location={place.location}
              owner={me === owner ? true : false}
              author={place.author}
            />
          );
        })}
      </SitesHolder>
    </section>
  );
}

export default MisSitios;
