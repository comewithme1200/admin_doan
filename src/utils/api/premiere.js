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



export { getPremieres };
