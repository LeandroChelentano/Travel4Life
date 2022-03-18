import React from "react";
import styled from "styled-components";
import { MdClear, MdSave } from "react-icons/md";
import { newSite } from "../Utils";
import { Store } from "react-notifications-component";

function Newplace() {
  //* This cannot be done with state (i think), if I update the state the values of the textboxes are going to disapear.
  let images = [];

  const handleImageUpload = (e) => {
    images = [...e.target.files];
  };

  function success(titulo, mensaje) {
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

  async function handleFormSubmision() {
    let name = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let location = document.getElementById("location").value;

    let coordinates = "";

    function encode(img) {
      return new Promise((resolve) => {
        let FR = new FileReader();
        FR.onload = () => {
          return resolve(FR.result);
        };
        FR.readAsDataURL(img);
      });
    }

    let photos = await Promise.all(
      images.map((img) => {
        return encode(img);
      })
    );

    if (photos.length === 0 || photos.length > 3) {
      error(
        "Ha ocurrido un error",
        "Solo puedes colocar de una a tres imagenes"
      );
      return;
    }

    let data = await newSite(name, description, location, coordinates, photos);
    console.log(data);

    data.success
      ? success("Excelente!", "Tu sitio se ha publicado con éxito")
      : error(
          "Que pena..",
          "Parece que ha ocurrido un error, deberias contactar un administrador."
        );
  }

  document.title = "Nuevo Sitio - Travel4Ever";

  //#region Styles
  const Section = styled.section`
    width: 100%;
  `;

  const Header = styled.header`
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    padding: 1em;
  `;

  const Title = styled.h1``;

  const Close = styled(MdClear)`
    cursor: pointer;
    font-size: 1.5em;
  `;

  const Save = styled(MdSave)`
    cursor: pointer;
    font-size: 1.5em;
  `;

  const Icons = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1em;
  `;

  const Separator = styled.hr`
    margin: 0 1em 0.5em 1em;
    color: black;
  `;

  const Details = styled.div`
    width: 80%;
    max-width: 500px;
    margin: 0 auto;
    padding: 0.5em 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;

  const Label = styled.p`
    font-size: 1.2em;
    margin: 0.1em 0 0.3em 0.4em;
  `;

  const Input = styled.input`
    font-size: 1.3em;
    padding: 0.2em;
    border: 1px solid lightgray;
    border-bottom: 3px solid black;
    margin-bottom: 0.7em;

    &:focus {
      outline: none !important;
      box-shadow: 0;
    }
  `;

  const Images = styled.input`
    margin-left: 1em;
  `;
  //#endregion

  return (
    <Section>
      <Header>
        <Title>Nuevo Sitio</Title>
        <Icons>
          <Save onClick={() => handleFormSubmision()} />
          <Close
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </Icons>
      </Header>
      <Separator />
      <Details>
        <Label>Titulo:</Label>
        <Input id={"title"} />
        <Label>Descripción:</Label>
        <Input id={"description"} />
        <Label>¿Donde se encuentra?</Label>
        <Input id={"location"} />
        <Label>Adjunta fotos del lugar! (Max. 3)</Label>
        <Images
          type="file"
          multiple
          accept="image/*"
          alt="input image"
          onChange={(e) => handleImageUpload(e)}
        />
      </Details>
    </Section>
  );
}

export default Newplace;
