import React, { Component } from "react";
import styled from "styled-components";
import { FaRegTrashAlt, FaPen } from "react-icons/fa";
import { deletePost } from "../Utils.js";
import { Store } from "react-notifications-component";

class Site extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showingContextualMenu: false,
    };
  }

  handleContextualMenu = (passTo) => {
    this.setState({ showingContextualMenu: passTo });
  };

  handleDeletion = async (postId) => {
    const token = localStorage.getItem("travel4ever");
    const post = postId;

    let data = await deletePost(token, post);

    data.success
      ? this.success(
          "Operacion efectuada",
          "El lugar se ha eliminado con exito."
        )
      : this.error(
          "Ha ocurrido un error",
          "Se ha efectuado un error en su operacion, intentelo mas tarde o consulte con un administrador."
        );

    if (data.success) window.location.reload(false);
  };

  success(titulo, mensaje) {
    Store.addNotification({
      title: titulo,
      message: mensaje,
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
  }

  error(titulo, mensaje) {
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

  render() {
    //#region Styles
    const Article = styled.article`
      margin: 1em 0.3em;
      padding: 1em;
      width: 42%;

      background-color: white;
      border: 1px solid black;
      border-radius: 10px;
      cursor: pointer;

      @media (max-width: 1040px) {
        width: 90%;
      }
    `;

    const Title = styled.h2`
      font-weight: bolder;
    `;
    //#endregion

    return (
      <Article
        onClick={() =>
          (window.location = `/profile/${this.props.author}/itinerarys/${this.props.title}`)
        }
      >
        <Title>{this.props.title}</Title>
      </Article>
    );
  }
}

export default Site;
