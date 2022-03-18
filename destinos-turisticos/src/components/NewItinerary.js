import React, { useState, useEffect } from "react";
import { getallsites, newItinerary } from "../Utils";
import Space from "./Space";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactSearchBox from "react-search-box";
import { Store } from "react-notifications-component";

export default function NewItinerary() {
  const [spaces, setSpaces] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  const [title, setTitle] = useState("");

  document.title = "Nuevo Itinerario - Travel4Ever";

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

  const updateTitle = () => {
    let input = document.getElementById("title").value;
    setTitle(input);
  };

  const handleAddSpace = (e) => {
    let id = e.item.key;
    let title = e.item.value;

    let duplied = false;
    spaces.forEach((place) => {
      if (place.id === id) {
        error("Error!", "Ya existe ese sitio en este ininerario");
        duplied = true;
      }
    });

    if (duplied) return;

    let copy = Array.from(spaces);
    copy.push({ id: id, title: title });

    setSpaces(copy);
  };

  const handleCreate = async () => {
    if (spaces.length === 0) {
      error(
        "Se ha producido un error..",
        "El itinerario no contiene ningun sitio."
      );
      return;
    }

    if (title === "") {
      error(
        "Se ha producido un error..",
        "El titulo del itinerario está vacío"
      );
      return;
    }

    let result = await newItinerary(title, JSON.stringify(spaces));

    if (result.success) {
      success("Exito", "El itinerario se ha agregado correctamente.");
    } else {
      error("Ha ocurrido un error", result.message);
    }
  };

  useState(async () => {
    if (searchResult.length === 0) setSearchResult(await getallsites());
  }, [setSearchResult]);

  const handleOnDragEnd = (res) => {
    if (!res.destination) return;

    const items = Array.from(spaces);
    const [reOrderItems] = items.splice(res.source.index, 1);
    items.splice(res.destination.index, 0, reOrderItems);

    setSpaces(items);
  };

  //#region
  const SpaceHolder = styled.ul`
    height: fit-content;
    display: flex;
    flex-direction: column;
    padding: 1em;
    padding-bottom: 0.5em;

    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
  `;

  const Item = styled.div`
    list-style: none;
  `;

  const Header = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 0.5em 1em;

    border: 1px solid black;
    border-radius: 5px;
    background-color: white;
  `;

  const Save = styled.button`
    padding: 0.5em;
    font-weight: bold;
    border-radius: 10px;
    background-color: white;
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

    @media (max-width: 700px) {
      width: 75%;
    }

    @media (max-width: 500px) {
      width: 80%;
    }
  `;

  const SiteName = styled.input`
    width: 75%;
    margin: 0 auto;
    border: 0;
    border-bottom: 1px solid black;
    padding: 0.5em 1em;
    font-size: 1.2em;
    text-align: center;
    margin-top: 1em;

    &:focus {
      outline: none !important;
      box-shadow: 0;
    }
  `;

  const Empty = styled.h4`
    color: gray;
    text-align: center;
    margin-bottom: 0.5em;
  `;

  const Title = styled.h1`
    padding: 1em 0 0.5em 1em;
  `;

  const Separator = styled.hr`
    margin: 0 1em 0.5em 1em;
    color: black;
  `;
  //#endregion

  return (
    <section>
      <Title>Nuevo Itinerario</Title>
      <Separator />
      <Center>
        <SiteName
          id="title"
          type="text"
          placeholder="Nombre del itinerario"
          defaultValue={title}
          onBlur={() => updateTitle()}
        ></SiteName>
        <Header>
          <ReactSearchBox
            inputBorderColor="white"
            inputFontSize="1.1em"
            placeholder="Nuevo sitio.."
            data={searchResult}
            onSelect={(e) => handleAddSpace(e)}
          />
        </Header>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="items">
            {(provided) => (
              <SpaceHolder
                className="items"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {spaces.length === 0 ? (
                  <Empty>No hay lugares!</Empty>
                ) : (
                  spaces.map((place, index) => {
                    return (
                      <Draggable
                        key={place.id}
                        draggableId={place.title}
                        index={index}
                      >
                        {(provided) => (
                          <Item
                            {...provided.draggableProps}
                            ref={provided.innerRef}
                            {...provided.dragHandleProps}
                          >
                            <Space title={place.title} />
                          </Item>
                        )}
                      </Draggable>
                    );
                  })
                )}
                {provided.placeholder}
              </SpaceHolder>
            )}
          </Droppable>
        </DragDropContext>
        <Save onClick={() => handleCreate()}>CREAR</Save>
      </Center>
    </section>
  );
}
