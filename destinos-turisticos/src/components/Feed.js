import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Store } from "react-notifications-component";
import { search, getallplacesnophotos } from "../Utils";
import FeedResult from "./FeedResult";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";

export default function Feed() {
  const [input, setInput] = useState("");
  const [results, setResult] = useState([]);

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }
  let query = useQuery();

  useState(() => {
    if (localStorage.getItem("travel4eversayhi")) {
      Store.addNotification({
        title: "Sesión iniciada!",
        message:
          "Su sesión en Travel4Ever ha sido iniciada correctamente, vea y comparta novedosos itinerarios ;)",
        type: "success",
        insert: "bottom",
        container: "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 7000,
          onScreen: true,
        },
      });
      localStorage.removeItem("travel4eversayhi");
    }

    (async () => {
      const input = query.get("query");
      if (input !== null) {
        let data = await search(input);
        setInput(input);
        setResult(data.result);
      } else {
        setResult(await getallplacesnophotos());
      }
    })();
  });

  const handleSearch = async () => {
    let input = document.getElementById("searchBox").value;
    window.location = `?query=${input}`;
  };

  //#region Styles
  const SearchBox = styled.input`
    font-size: 1.1em;
    background-color: transparent;
    border: 0;
    width: 90%;

    &:focus {
      outline: none !important;
      box-shadow: 0;
    }
  `;

  const Feed = styled.main``;

  const Top = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin: 2em 0;
  `;

  const Lupa = styled(MdSearch)`
    cursor: pointer;
    font-size: 1.2em;

    &:hover {
      color: gray;
    }
  `;

  const TopSearch = styled.div`
    border: 1px solid lightgray;
    border-radius: 20px;
    padding: 0.5em 1em;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 40%;

    @media (max-width: 850px) {
      width: 60%;
    }

    @media (max-width: 500px) {
      width: 80%;
    }
  `;

  const Count = styled.h3`
    font-weight: normal;
    margin: 0.5em 1em;
    font-size: 1em;
    color: gray;
  `;
  //#endregion

  document.title = "Inicio - Travel4Ever";

  return (
    <Feed>
      <Top>
        <TopSearch>
          <SearchBox
            type="text"
            id="searchBox"
            defaultValue={input}
            placeholder="Sitio o itinerario a buscar.."
          />
          <Lupa onClick={() => handleSearch()} />
        </TopSearch>
      </Top>
      <Count>{`${
        results ? results.length : ""
      } resultados encontrados.`}</Count>
      {results.map((article, index) => {
        return (
          <FeedResult
            key={index}
            index={index}
            title={article.title}
            description={
              article.type === "Sitio"
                ? article.description
                : `${article.places[0].title}...`
            }
            author={article.author}
            type={article.type}
            date={article.date}
          />
        );
      })}
    </Feed>
  );
}
