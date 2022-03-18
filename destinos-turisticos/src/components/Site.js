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

    const Separator = styled.hr`
      color: black;
      margin: 0.5em 0;
    `;

    const Description = styled.p`
      font-size: 1.1em;
      word-wrap: break-word;
      margin-top: 0.3em;
    `;

    const Bottom = styled.div``;

    const Date = styled.p``;

    const Link = styled.button`
      padding: 0;
      font-size: 1em;
      background-color: transparent;
      border: 0;
    `;

    const Place = styled.p``;

    const Image = styled.img`
      width: 100%;
    `;

    const Top = styled.div`
      width: 100%;
      height: fit-content;
      display: ${this.props.owner && this.state.showingContextualMenu
        ? "flex"
        : "none"};
      flex-direction: row;
      justify-content: end;
    `;

    const Delete = styled(FaRegTrashAlt)``;

    const Pen = styled(FaPen)``;

    const Group = styled.div`
      display: flex;
      gap: 0.5em;
      padding: 0.5em;
      background-color: white;
      border: 1px solid black;
      border-radius: 10px;
      margin: 0 0 0.5em 0.5em;
    `;

    //#endregion

    return (
      <Article
        onMouseEnter={() => this.handleContextualMenu(true)}
        onMouseLeave={() => this.handleContextualMenu(false)}
      >
        <Top>
          <Group>
            <Pen
              onClick={() =>
                (window.location = `/profile/${this.props.author}/sites/${this.props.name}?edit=true`)
              }
            />
            <Delete
              onClick={() => this.handleDeletion(parseInt(`${this.props.id}`))}
            />
          </Group>
        </Top>
        <div
          onClick={() =>
            (window.location = `/profile/${this.props.author}/sites/${this.props.name}`)
          }
        >
          <Image src={this.props.photo} alt={`Foto de ${this.props.name}`} />
          <Title>{this.props.name}</Title>
          <Place>{this.props.location}</Place>
          <Separator />
          <Description>{this.props.description}</Description>
          <Bottom>
            <Date>{`${this.props.date.getDate()}
          /${this.props.date.getMonth()}
          /${this.props.date.getFullYear()}`}</Date>
          </Bottom>
        </div>
      </Article>
    );
  }
}

export default Site;
