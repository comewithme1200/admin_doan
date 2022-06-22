const BASE_URL = "http://localhost:8080/";

const getMovies = async (query) => {
  var url;
  if (query) {
    url = `${BASE_URL + `movies/filter?${query}`}`;
  } else {
    url = `${BASE_URL + `movies/getAll`}`;
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

const createMovie = async (token, form) => {
  const url = `${BASE_URL + `movies`}`;
  console.log(url);
  let formData = new FormData();
  const value = {
    movie_name: form.movie_name,
    detail: form.detail,
    premiere_date: form.premiere_date,
    trailer_link: form.trailer_link,
    time: form.time
  }
  console.log("Form: " + form.image.files);
  console.log(JSON.stringify(value));
  const blob = new Blob([JSON.stringify(value, null, 2)], {type : 'application/json'});
  formData.append('file', form.image.files[0]);
  formData.append('movieCreateParam', blob);
  try {
    const request = await fetch(url, 
      {
        body: formData,
        method: "post",
        headers: {
          Authorization: `Token ${token}`
        }
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const updateMovie = async (token, form, movieDetailId) => {
  const url = BASE_URL + `movies?id=` + movieDetailId;
  console.log(url);
  console.log(form);
  let formData = new FormData();
  const value = {
    movie_name: form.movie_name,
    detail: form.detail,
    premiere_date: new Date(form.premiere_date).getTime(),
    trailer_link: form.trailer_link,
    time: form.time
  }
  console.log("Form: " + form.image.files);
  console.log(JSON.stringify(value));
  const blob = new Blob([JSON.stringify(value, null, 2)], {type : 'application/json'});
  formData.append('file', form.image ? form.image.files[0] : null);
  formData.append('movie', blob);
  try {
    const request = await fetch(url, 
      {
        body: formData,
        method: "put",
        headers: {
          Authorization: `Token ${token}`
        }
    });

    return request ;
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const updateMovieWithout = async (token, form, movieDetailId) => {
  const url = BASE_URL + `movies/withoutFile?id=` + movieDetailId;
  console.log(url);
  const value = {
    movie_name: form.movie_name,
    detail: form.detail,
    premiere_date: new Date(form.premiere_date).getTime(),
    trailer_link: form.trailer_link,
    time: form.time
  }
  console.log(JSON.stringify(value));
  try {
    const request = await fetch(url, 
      {
        body: JSON.stringify(value),
        method: "put",
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json"
        }
    });

    return request;
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const getMovieById = async (token, movieDetailId) => {
  console.log(movieDetailId);
  const url = `${BASE_URL + `movies/getMovieInfo?id=` + movieDetailId}`;
  const requestOptions = { headers: { Authorization: `Token ${token}` } };
  console.log(url);
  try {
    const request = await fetch(url, requestOptions);
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const deleteMovie = async (token, id) => {
  const url = `${BASE_URL + `movies?id=` + id}`;
  console.log(url);
  try {
    const request = await fetch(url, 
      {
        method: "delete",
        headers: {
          Authorization: `Token ${token}`
        }
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

export { getMovies, createMovie, getMovieById, deleteMovie, updateMovie, updateMovieWithout };
