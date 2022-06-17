const BASE_URL = "http://localhost:8080/";

const login = async ({ form }) => {
  const url = BASE_URL + `users/login`;
  const requestOptions = {
    method: "POST",
    body: JSON.stringify(form),
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const request = await fetch(url, requestOptions);
    if (request.status === 400) {
      throw new Error("Datos invalidos");
    }
    const data = await request.json();
    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

const getMe = async ({ token }) => {
  const url = BASE_URL + `users`;
  const requestOptions = { headers: { Authorization: `Token ${token}` } };

  try {
    const request = await fetch(url, requestOptions);
    const data = await request.json();
    console.log(data);

    return { request, data };
  } catch (e) {
    return { request: { ok: false, message: e.message } };
  }
};

export { login, getMe };
