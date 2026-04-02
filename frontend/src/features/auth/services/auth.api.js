import { api } from "../../../api/apiConfig";

export async function register({ username, email, fullname, password }) {
  const response = await api.post("/auth/register", {
    email,
    username,
    fullname,
    password,
  });
  return response.data;
}

export async function login({ usernameOrEmail, password }) {
  const emialRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmail = emialRegex.test(usernameOrEmail);

  const payload = { password };

  if (isEmail) {
    payload.email = usernameOrEmail;
  } else {
    payload.username = usernameOrEmail;
  }

  const response = await api.post("/auth/login", payload);
  return response.data;
}

export async function getMe() {
  const response = await api.get("auth/me");

  return response.data;
}
