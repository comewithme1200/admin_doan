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
    trailer_link: form.trailer_link
  }
  console.log("Form: " + form.image.files);
  console.log(value);
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

export { getMovies, createMovie };
