const BASE_URL = "http://localhost:8080/";

const getPremieres = async (query) => {
  var url;
  if (query) {
    url = `${BASE_URL + `premiere/filter?${query}`}`;
  } else {
    url = `${BASE_URL + `premiere/getInfo`}`;
  }

  console.log(url);
  try {
    const request = await fetch(url, {
      headers: {
      },
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const getPremiereDetail = async (premiereDetailId) => {
  const url = BASE_URL + `premiere/getById?id=` + premiereDetailId;


  console.log(url);
  try {
    const request = await fetch(url, {
      headers: {
      },
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const createPremiere = async (token, form, movieId, roomId) => {
  const url = BASE_URL + `premiere/create`;
  const data = {
    start_time: form.start_time,
    end_time: form.end_time,
    movie_id: movieId,
    room_id: roomId
  }
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(data), 
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}` } 
  };
  try {
    const request = await fetch(url, requestOptions);
    const data = await request.json();
    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
}

const updatePremiere = async (token, form, movieId, roomId, premiereDetailId) => {
  const url = BASE_URL + `premiere?id=` + premiereDetailId;
  const data = {
    start_time: form.start_time,
    end_time: form.end_time,
    movie_id: movieId,
    room_id: roomId
  }
  console.log(JSON.stringify(data));
  const requestOptions = {
    method: "PUT",
    body: JSON.stringify(data), 
    headers: {
    "Content-Type": "application/json",
    "Authorization": `Token ${token}` } 
  };
  try {
    const request = await fetch(url, requestOptions);
    const data = await request.json();
    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
}


export { getPremieres, createPremiere, getPremiereDetail, updatePremiere };
