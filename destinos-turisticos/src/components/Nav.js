import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CgProfile, CgHomeAlt } from "react-icons/cg";
import { MdMap, MdOutlineRoom } from "react-icons/md";
import { getuser } from "../Utils.js";

function Nav(props) {
  const [user, setUser] = useState("");
  useEffect(() => {
    (async () => {
      if (user === "") setUser(await getuser());
    })();
  }, [user]);

  const redirect = (target) => {
    window.location = target;
  };

  //#region Styles
  const Nav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 3.5em;

    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;

    z-index: 10;
    background-color: white;
    border-bottom: 1px solid black;
  `;

  const Logo = styled.img`
    height: 100%;
  `;

  const Main = styled.main`
    position: absolute;
    width: 50%;
    top: 3.5em;
    left: 25%;

    height: fit-content;

    border: 1px solid lightgray;
    border-top: 0;
    border-bottom: 0;
    padding-bottom: 2em;

    @media (max-width: 1700px) {
      width: 60%;
      left: 20%;
    }

    @media (max-width: 1400px) {
      width: 70%;
      left: 15%;
    }

    @media (max-width: 1200px) {
      width: 80%;
      left: 10%;
    }

    @media (max-width: 500px) {
      width: 100%;
      left: 0;
      border: 0;
    }
  `;

  const ButtonsHolder = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 0.5em;

    height: 100%;
  `;

  const IconsHeight = "1.5em";
  const Profile = styled(CgProfile)`
    font-size: ${IconsHeight};
    cursor: pointer;
  `;

  const Home = styled(CgHomeAlt)`
    font-size: ${IconsHeight};
    cursor: pointer;
  `;

  const Itinerary = styled(MdMap)`
    font-size: ${IconsHeight};
    cursor: pointer;
  `;

  const Site = styled(MdOutlineRoom)`
    font-size: ${IconsHeight};
    cursor: pointer;
  `;

  //#endregion

  return (
    <>
      <Nav>
        <Logo src={require("../Travel4Life.png")} />
        <ButtonsHolder>
          <Home onClick={() => redirect("/")} />
          <Site onClick={() => redirect("/site/new")} />
          <Itinerary onClick={() => redirect("/itinerarys/new")} />
          <Profile onClick={() => redirect(`/profile/${user}`)} />
        </ButtonsHolder>
      </Nav>
      <Main id="main">{props.display}</Main>
    </>
  );
}

export default Nav;
