import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Missitios from "./components/MisSitios";
import Nav from "./components/Nav";
import Newplace from "./components/NewPlace";
import Profile from "./components/Profile";
import Itinerarys from "./components/Itinerarys";
import NewItinerary from "./components/NewItinerary";
import SpecificSite from "./components/SpecificSite";
import EditItinerary from "./components/EditItinerary";

//! Notification related.
ReactDOM.render(
  <ReactNotifications />,
  document.getElementById("notifications")
);

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />

      <Route path="/login" element={<Login />} />

      <Route path="/site/new" element={<Nav display={<Newplace />} />} />

      <Route
        path="/itinerarys/new"
        element={<Nav display={<NewItinerary />} />}
      />

      <Route path="/profile/:user" element={<Nav display={<Profile />} />} />
      <Route
        // path="/profile/:user/sites/:site"
        path="/profile/:user/sites/:site"
        element={<Nav display={<SpecificSite />} />}
      />
      <Route
        path="/profile/:user/itinerarys/:itinerary"
        element={<Nav display={<Itinerarys />} />}
      />
      <Route
        path="/profile/:user/itinerarys/:itinerary/edit"
        element={<Nav display={<EditItinerary />} />}
      />
    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
