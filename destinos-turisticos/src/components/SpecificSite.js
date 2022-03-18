import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { publicofuser, getuser, getSite, editsite, newReview } from "../Utils";
import styled from "styled-components";
import Review from "./Review";
import { Store } from "react-notifications-component";
import uuid from "react-uuid";
import Star from "./Star";

export default function SpecificSite() {
  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const [owner, setOwner] = useState("");
  const [me, setMe] = useState("");
  const [site, setSite] = useState("");
  const [editing, setEditing] = useState(false);
  const [fecha, setFecha] = useState("");
  const [score, setScore] = useState(0);
  const [stars, setStars] = useState([]);

  let params = useParams();
  let query = useQuery();

  const navigate = useNavigate();

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

  if (!editing && query.get("edit") !== null) setEditing(true);

  useEffect(() => {
    (async () => {
      if (owner === "") {
        let res = await publicofuser(params.user);
        setOwner(res);
      }

      if (site === "") {
        let res = await getSite(params.site, owner.username);
        setSite(res);
      }

      setMe(await getuser());

      if (site && fecha === "") {
        let input = site.time;
        let date = new window.Date(input);
        setFecha(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`);
      }

      if (site.reviews && site.reviews.length > 0 && score === 0) {
        let sum = 0;
        site.reviews.forEach((review) => {
          sum += review.calification;
        });
        let wDecimal = sum / site.reviews.length;
        setScore(Math.round(wDecimal));
      }

      if (score > 0 && stars.length === 0) {
        let temp = new Array(5);
        for (let i = 0; i < temp.length; i++) {
          i < score ? (temp[i] = true) : (temp[i] = false);
        }
        setStars(temp);
      }

      if (site) {
        document.title = `
          ${site.name} 
          - Travel4Ever
        `;
      }

      if (site === "404") {
        document.title = "Not Found - Travel4Ever";
      }
    })();
  }, [params, owner, site, fecha, score, stars]);

  const isMe = () => {
    return me === owner.username ? true : false;
  };

  const handleEdition = async () => {
    console.log("editing");
    let siteId = site.id;
    let title = document.getElementById("txtTitle").value;
    let desc = document.getElementById("txtDesc").value;
    let location = document.getElementById("txtLocation").value;
    let status = await editsite(siteId, title, desc, location);

    console.log(status);
    if (status.success) {
      console.log("success");
      window.location = `/profile/${me}/sites/${title}`;
    }
  };

  const handleAddReview = async () => {
    const placeId = site.id;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const calification = document.getElementById("calification").value;

    if (
      title === "" ||
      calification === "" ||
      parseInt(calification) > 5 ||
      parseInt(calification) < 1 ||
      description === "" ||
      calification === ""
    ) {
      error("Error", "Hay un error con los datos ingresados.");
      return;
    }

    const data = await newReview(
      placeId,
      title,
      parseInt(calification),
      description
    );

    setOwner("");
    setSite("");
    window.location.reload(false);
  };

  //#region Styles
  const Image = styled.img`
    width: 45%;
    max-width: ${site && site !== "404"
      ? site.photos.length === 3
        ? "30%"
        : "45%"
      : ""};
    min-width: 300px;
    border-radius: 10px;
  `;

  const Top = styled.header`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1em;
    padding: 1em;
  `;

  const EditButton = styled.button`
    margin-left: 1em;
    border: 0;
    background-color: transparent;
    font-size: 1.1rem;
    font-weight: bold;
    display: ${isMe() && !editing ? "inline" : "none"};
    cursor: pointer;
  `;

  const Title = styled.h1`
    font-size: 1.4em;
    display: inline;
    display: ${isMe() && editing ? "none" : "inline"};
  `;

  const Body = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1em;

    width: 90%;
    padding: 1em 5% 0 5%;
  `;

  const Separator = styled.hr`
    margin: 0.5em 0;
  `;

  const Desc = styled.p`
    font-size: 1.1em;
    display: ${isMe() && editing ? "none" : "block"};
  `;

  const Location = styled.h4`
    font-style: italic;
    display: ${isMe() && editing ? "none" : "block"};
  `;

  const Date = styled.h4`
    color: gray;
  `;

  const Save = styled.button`
    display: ${isMe() && editing ? "block" : "none"};
    background-color: transparent;
    border: 0;
    text-align: center;
    margin-top: 0.5em;
    font-weight: bold;
    font-size: 1.1em;
    cursor: pointer;
  `;

  const TitleEdit = styled.input`
    border: 0;
    border-bottom: 2px solid black;
    font-size: 1.4em;
    display: ${isMe() && editing ? "block" : "none"};

    &:focus {
      outline: none;
    }
  `;

  const LocationEdit = styled.input`
    border: 0;
    border-bottom: 2px solid black;
    font-size: 20px;
    display: ${isMe() && editing ? "block" : "none"};

    &:focus {
      outline: none;
    }
  `;

  const DescEdit = styled.textarea`
    border: 0;
    border-bottom: 2px solid black;
    resize: vertical;
    font-size: 1.1em;
    display: ${isMe() && editing ? "block" : "none"};

    &:focus {
      outline: none;
    }
  `;

  const WriteReview = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 0.8em;
  `;

  const ReviewTitle = styled.input`
    border: 0;
    border-bottom: 2px solid black;
    width: 50%;
    padding: 0.5em;

    &:focus {
      outline: none;
    }

    @media (max-width: 800px) {
      width: 70%;
      padding: 1%;
    }

    @media (max-width: 650px) {
      width: 96%;
      padding: 2%;
    }
  `;

  const Num = styled.input`
    &:focus {
      outline: none;
    }
    border: 0;
    border-bottom: 2px solid black;
    width: fit-content;
    padding: 0.5em;

    @media (max-width: 800px) {
      padding: 1%;
    }

    @media (max-width: 500px) {
      padding: 2%;
    }
  `;

  const Description = styled.textarea`
    border: 0;
    border-bottom: 2px solid black;
    resize: vertical;
    width: 50%;
    padding: 0.5em;

    &:focus {
      outline: none;
    }

    @media (max-width: 800px) {
      width: 70%;
      padding: 1%;
    }

    @media (max-width: 650px) {
      width: 96%;
      padding: 2%;
    }
  `;

  const Send = styled.button`
    background-color: transparent;
    border: 0;
    text-align: center;
    margin-top: 1em;
    font-weight: bold;
    font-size: 1.1em;
    cursor: pointer;
    display: block;
    width: 50%;

    @media (max-width: 800px) {
      width: 70%;
    }

    @media (max-width: 650px) {
      width: 100%;
    }
  `;

  const Flex = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
  `;

  const General = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  `;

  const NotFound = styled.h2`
    text-align: center;
    margin-top: 2em;
  `;

  const StarsOnHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
  `;
  //#endregion

  return site !== "404" ? (
    <Flex key={uuid()}>
      <Top>
        {site
          ? site.photos.map((img, index) => {
              return (
                <Image
                  key={uuid()}
                  src={img}
                  alt={`${site.name} - nro. ${index}`}
                />
              );
            })
          : ""}
      </Top>
      <Body>
        <General>
          <div>
            <Title onClick={() => setSite("")}>{site ? site.name : ""}</Title>
            <TitleEdit
              id="txtTitle"
              type="text"
              defaultValue={site ? site.name : ""}
              placeholder="Titulo"
            />
            <EditButton onClick={() => navigate(`?edit=true`)}>
              Editar Sitio
            </EditButton>
          </div>
          <StarsOnHeader>
            <h4 style={{ display: "inline" }}>Calificación: </h4>
            <div>
              {stars.map((star) => {
                return <Star checked={star} />;
              })}
            </div>
          </StarsOnHeader>
          <Date>{site ? `Creado el ${fecha}` : ""}</Date>
          <Location>{`~ ${site ? site.location : ""}`}</Location>
          <LocationEdit
            id="txtLocation"
            type="text"
            defaultValue={`${site ? site.location : ""}`}
            placeholder="Ubicación"
          />
          <Desc>{site ? site.description : ""}</Desc>
          <DescEdit
            id="txtDesc"
            type="text"
            defaultValue={site ? site.description : ""}
            placeholder="Descripción"
          />
          <Save onClick={() => handleEdition()}>Guardar cambios</Save>
        </General>
        <Separator />
        {site && site.reviews.length > 0 ? (
          site.reviews.map((review, index) => {
            return (
              <Review
                id={index}
                title={review.title}
                description={review.description}
                calification={review.calification}
                author={review.author}
                siteId={site ? site.id : ""}
              />
            );
          })
        ) : (
          <h3>Aun no hay reviews..</h3>
        )}
        <Separator />
        <WriteReview>
          <h2>Escribe tu review!</h2>
          <div>
            <h4>Titulo:</h4>
            <ReviewTitle type="text" id="title" />
          </div>
          <div>
            <h4>Calificación:</h4>
            <Num type="number" id="calification" min="1" max="5" />
          </div>
          <div>
            <h4>Descripción:</h4>
            <Description id="description"></Description>
            <Send onClick={() => handleAddReview()}>ENVIAR</Send>
          </div>
        </WriteReview>
      </Body>
    </Flex>
  ) : (
    <NotFound>404</NotFound>
  );
}
