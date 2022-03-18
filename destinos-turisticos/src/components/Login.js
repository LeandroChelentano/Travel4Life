import React, { Component } from "react";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import styled from "styled-components";
import { Store } from "react-notifications-component";

import { getIp, login, register } from "../Utils";

const background = require("../loginBG.png");

class Login extends Component {
  render() {
    document.title = "Iniciar sesion - Travel4Ever";

    //#region CSS
    const Main = styled.main`
      padding: 2em;
      background-color: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px);
      border-radius: 10px;
      width: fit-content;
      height: fit-content;
      margin: 10% auto;

      @media (max-width: 768px) {
        padding: 1em 0;
        margin: 30% 0;
      }
    `;

    const Label = styled.label`
      width: 130px;
      display: inline-block;
      text-align: end;
      margin-right: 10px;
      font-size: 1.3rem;

      @media (max-width: 768px) {
        text-align: start;
      }
    `;

    const Input = styled.input`
      font-size: 1.3rem;
      padding: 0.4em;
      border: 1px solid lightgray;
      border-radius: 10px;
    `;

    const Background = styled.img`
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 0;

      @media (max-width: 768px) {
        height: 100%;
      }
    `;

    const Link = styled.a`
      text-decoration: none;
      color: black;
    `;
    //#endregion

    function error(titulo, mensaje) {
      Store.addNotification({
        title: titulo,
        message: mensaje,
        type: "danger",
        insert: "bottom",
        container: "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 7000,
          onScreen: true,
        },
      });
    }

    async function accessHandler() {
      let user = document.querySelector("#usrnm").value;
      let pass = document.querySelector("#passwd").value;
      if (user === "" || pass === "") {
        error(
          "Has olvidado algo..",
          "Debes proporcionar la informacion en los campos!"
        );
        return;
      }

      let ip = await getIp();
      let data = await login(user, pass, ip);
      if (data.success) {
        localStorage.setItem("travel4ever", parseInt(data.token));
        localStorage.setItem("travel4eversayhi", true);
        window.location.href = "/";
      } else {
        error("Error en su sesión", data.message);
        document.querySelector("#passwd").value = "";
      }
    }

    async function registerHandler() {
      let user = document.querySelector("#usrnm").value;
      let pass = document.querySelector("#passwd").value;
      if (user === "" || pass === "") {
        error(
          "Has olvidado algo..",
          "Debes proporcionar la informacion en los campos!"
        );
        return;
      }

      let ip = await getIp();
      let data = await register(user, pass, ip);
      if (data.success) {
        localStorage.setItem("travel4ever", parseInt(data.token));
        localStorage.setItem("travel4eversayhi", true);
        window.location.href = "/";
      } else {
        error("Upss..", data.message);
        document.querySelector("#passwd").value = "";
      }
    }

    return (
      <>
        <Background src={background} id="loginBackground" alt="background" />
        <Main id="loginMain">
          <h1 style={{ textAlign: "center", marginTop: "0" }}>Inicia sesión</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: "0.5em" }}>
              <Label htmlFor="user">Usuario:</Label>
              <Input type="text" name="user" id="usrnm" />
            </div>
            <div style={{ padding: "0.5em" }}>
              <Label htmlFor="pass">Constraseña:</Label>
              <Input type="password" name="pass" id="passwd" />
            </div>
            <Link href="#">Olvidé mi constraseña</Link>
            <div style={{ margin: "0.8em 0 0 0", display: "flex", gap: "1em" }}>
              <ButtonPrimary text="Acceder" click={() => accessHandler()} />
              <ButtonSecondary
                text="Registrarme"
                click={() => registerHandler()}
              />
            </div>
          </div>
        </Main>
      </>
    );
  }
}

export default Login;
