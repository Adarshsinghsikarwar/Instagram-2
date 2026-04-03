import { createBrowserRouter } from "react-router";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Home from "../features/posts/pages/Home";
import Profile from "../features/users/pages/Profile";
import AppLayout from "../components/layouts/AppLayout";
import CreatePost from "../features/posts/pages/CreatePost";
import Search from "../features/users/pages/Search";
import Story from "../features/users/pages/Story";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/create",
        element: <CreatePost />,
      },
      {
        path: "/search",
        element: <Search />,
      },
      {
        path: "/stories/:userId",
        element: <Story />,
      },
    ],
  },
]);
