import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.route.jsx";
import { useAuth } from "../features/auth/hooks/useAuth.jsx";
import { useEffect } from "react";

const App = () => {
  const { handleGetMe } = useAuth();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await handleGetMe();
      } catch (error) {
        // Keep app usable for unauthenticated users instead of crashing bootstrap.
        console.warn("User is not authenticated yet");
      }
    };

    initializeAuth();
  }, []);
  return <RouterProvider router={router} />;
};

export default App;
