const BASE_URL = "http://localhost:8080/";

const getRooms = async () => {
  const url = `${BASE_URL + `room`}`;

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



export { getRooms };
