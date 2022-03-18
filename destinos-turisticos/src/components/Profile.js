import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { publicofuser, getuser, edituser } from "../Utils";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Missitios from "./MisSitios";
import { MdMode } from "react-icons/md";
import uuid from "react-uuid";
import MisItinerarios from "./MisItinerarios";

function Profile() {
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const [owner, setOwner] = useState("");
  const [me, setMe] = useState("");
  const [editing, setEditing] = useState(false);

  let params = useParams();
  let query = useQuery();

  const navigate = useNavigate();

  if (!editing && query.get("edit") !== null) setEditing(true);

  useEffect(() => {
    (async () => {
      if (owner === "") {
        let res = await publicofuser(params.user);
        setOwner(res);
      }

      setMe(await getuser());

      if (owner !== "" && owner.user !== "404") {
        document.title = `
          ${owner.username[0].toUpperCase()}${owner.username.slice(1)} 
          - Travel4Ever
        `;
      }
    })();
  }, [params.user, owner]);

  const isMe = () => {
    return me === owner.username ? true : false;
  };

  const handleProfileEdition = async () => {
    let token = localStorage.getItem("travel4ever");
    let name = document.getElementById("txtName").value;
    let desc = document.getElementById("txtDesc").value;

    let status = await edituser(token, name, desc);

    console.log(status);

    if (status.success) {
      window.location = "?";
    }
  };

  //#region Styles
  const LogOut = styled.button`
    display: ${isMe() & !editing ? "block" : "none"};
    font-weight: bold;
    font-size: 1.1em;
    border: 0;
    background-color: transparent;
    cursor: pointer;
  `;

  const Header = styled.header`
    width: 70%;
    position: relative;
    left: 15%;
    display: flex;
    flex-direction: column;
    justify-content: start;

    gap: 1em;
    padding-top: 3em;
  `;

  const Top = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1em;
  `;

  const Num = styled.p`
    font-weight: bold;
    display: inline;
  `;

  const Name = styled.h3`
    display: ${editing ? "none" : "block"};
    font-weight: bold;
  `;

  const EditName = styled.input`
    display: ${editing ? "block" : "none"};
    font-size: 1em;
    width: 400px;

    border: 0;
    border-bottom: 1px solid gray;
    padding-bottom: 0.3em;

    &:focus {
      outline: none !important;
      box-shadow: 0;
    }

    @media (max-width: 900px) {
      width: 100%;
    }
  `;

  const EditDesc = styled.textarea`
    display: ${editing ? "block" : "none"};
    font-size: 1em;
    width: 500px;
    height: 100px;

    border: 0;
    border-bottom: 1px solid gray;
    padding-bottom: 0.3em;
    resize: none;

    &:focus {
      outline: none !important;
      box-shadow: 0;
    }

    @media (max-width: 900px) {
      width: 100%;
    }
  `;

  const Save = styled.button`
    display: ${editing ? "block" : "none"};
    width: fit-content;
    background-color: transparent;
    border: 0;
    font-weight: bold;
    font-size: 1.1em;
    cursor: pointer;
  `;

  const Desc = styled.p`
    display: ${editing ? "none" : "block"};
    width: 100%;
  `;

  const Pencil = styled(MdMode)`
    display: ${isMe() && !editing ? "block" : "none"};
    cursor: pointer;
  `;

  const NotFound = styled.h2`
    text-align: center;
    margin-top: 2em;
  `;
  //#endregion

  return owner.user !== "404" ? (
    <Header key={uuid()}>
      <Top>
        <h2>{owner.username}</h2>
        <Pencil
          onClick={() => {
            navigate(`?edit=true`);
          }}
        />
        <LogOut
          onClick={() => {
            localStorage.removeItem("travel4ever");
            window.location = "/";
          }}
        >
          Log Out
        </LogOut>
      </Top>
      <div>
        <Num>{owner !== "" ? owner.places.length : ""}</Num> <span>Posts</span>
      </div>
      <div>
        <Name>{owner !== "" ? owner.name : ""}</Name>
        <EditName
          type="text"
          id="txtName"
          placeholder="Nombre"
          defaultValue={owner !== "" ? owner.name : ""}
        />
      </div>
      <div>
        {owner.description !== undefined
          ? owner.description.split("\n").map((line) => {
              return line === "" ? (
                <Desc key={uuid()}>{"\u00A0"}</Desc>
              ) : (
                <Desc key={uuid()}>{line}</Desc>
              );
            })
          : ""}
        <EditDesc
          type="text"
          id="txtDesc"
          placeholder="Descripcion"
          defaultValue={owner !== "" ? owner.description : ""}
        />
      </div>
      <Save onClick={() => handleProfileEdition()}>Guardar</Save>
      <hr />
      <Missitios />
      <MisItinerarios />
    </Header>
  ) : (
    <NotFound>404</NotFound>
  );
}

export default Profile;
