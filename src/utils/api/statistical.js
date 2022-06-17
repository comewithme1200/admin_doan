const BASE_URL = "http://localhost:8080/";

const getMovieTurnover = async (token) => {
  const url = `${BASE_URL + `statistical/movieturnover`}`;

  try {
    const request = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`
      },
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const getCinemaTurnover = async (token) => {
  const url = `${BASE_URL + `statistical/cinematurnover`}`;

  try {
    const request = await fetch(url, {
      headers: {
        Authorization: `Token ${token}`
      },
    });
    const data = await request.json();
    console.log(request)

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

export { getMovieTurnover, getCinemaTurnover };
