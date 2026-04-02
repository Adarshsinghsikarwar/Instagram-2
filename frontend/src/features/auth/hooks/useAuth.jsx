import { register, login, getMe } from "../services/auth.api";
import { setUser } from "../auth.slice";
import { useDispatch } from "react-redux";

export function useAuth() {
  const dispatch = useDispatch();

  async function handleRegister({ username, email, fullname, password }) {
    try {
      const data = await register({ username, email, fullname, password });
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      const backendMessage = error?.response?.data?.errors?.[0]?.msg;
      const fallbackMessage = error?.response?.data?.message;
      throw new Error(
        backendMessage || fallbackMessage || "Registration failed"
      );
    }
  }

  async function handleLogin({ usernameOrEmail, password }) {
    const data = await login({ usernameOrEmail, password });
    dispatch(setUser(data.user));
    return data;
  }

  async function handleGetMe() {
    try {
      const data = await getMe();
      dispatch(setUser(data.user));
      return data;
    } catch (error) {
      const backendMessage = error?.response?.data?.errors?.[0]?.msg;
      const fallbackMessage = error?.response?.data?.message;
      throw new Error(
        backendMessage || fallbackMessage || "Failed to fetch user information"
      );
    }
  }

  return { handleRegister, handleLogin, handleGetMe };
}
