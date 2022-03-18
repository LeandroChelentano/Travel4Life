const base = "http://localhost:2222";
// const base = "http://leandrochelentano.ddns.net:2222";

export const getuser = () => {
  return fetch(`${base}/getuser`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.user;
    });
};

export const login = (user, pass, ip) => {
  return fetch(`${base}/login`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      user: user,
      pass: pass,
      ip: ip,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const register = (user, pass, ip) => {
  return fetch(`${base}/register`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      user: user,
      pass: pass,
      ip: ip,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const validateToken = (token) => {
  return fetch(`${base}/validatetoken`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      token: token,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getSites = (username) => {
  return fetch(`${base}/places/getsites`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return JSON.parse(data.places);
    });
};

export const newSite = (name, description, location, coordinates, images) => {
  return fetch(`${base}/places/new`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      token: localStorage.getItem("travel4ever"),
      name: name,
      description: description,
      location: location,
      coordinates: coordinates,
      images: images,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const publicofuser = (username) => {
  return fetch(`${base}/publicofuser`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const deletePost = (token, post) => {
  return fetch(`${base}/places/deletepost`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      token: token,
      post: post,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const edituser = (token, name, desc) => {
  return fetch(`${base}/edituser`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      token: token,
      name: name,
      desc: desc,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const search = (name) => {
  return fetch(`${base}/search?name=${name}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getallsites = () => {
  return fetch(`${base}/search/getall`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    });
};

export const newItinerary = (title, places) => {
  return fetch(`${base}/itinerarys/new`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      title: title,
      places: places,
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getSite = (site, user) => {
  return fetch(`${base}/places/get?site=${site}&user=${user}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    });
};

export const editsite = (siteId, title, desc, location) => {
  return fetch(`${base}/places/edit`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      siteId: siteId,
      title: title,
      desc: desc,
      location: location,
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getItinerary = (user, itinerary) => {
  return fetch(`${base}/itinerarys/get?itinerary=${itinerary}&user=${user}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    });
};

export const getSiteById = (id) => {
  return fetch(`${base}/places/id?id=${id}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    });
};

export const getitinerarysfromuser = (user) => {
  return fetch(`${base}/itinerarys/getfromuser?user=${user}`, {
    headers: { "Content-Type": "application/json" },
    method: "GET",
  })
    .then((response) => response.json())
    .then((data) => {
      return data.data;
    });
};

export const editItinerary = (itineraryId, title, places) => {
  return fetch(`${base}/itinerarys/edit`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      itineraryId: itineraryId,
      title: title,
      places: JSON.stringify(places),
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const deleteReview = (placeId) => {
  return fetch(`${base}/reviews/delete`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      placeId: placeId,
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const newReview = (placeId, title, calification, description) => {
  return fetch(`${base}/reviews/new`, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: JSON.stringify({
      placeId: placeId,
      title: title,
      calification: calification,
      description: description,
      token: localStorage.getItem("travel4ever"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
};

export const getIp = () => {
  return fetch("https://geolocation-db.com/json/")
    .then((response) => response.json())
    .then((data) => {
      return data.IPv4;
    });
};

export const getallplacesnophotos = () => {
  return fetch(`${base}/search/getallplacesnophotos`)
    .then((response) => response.json())
    .then((data) => {
      return data.result;
    });
};
