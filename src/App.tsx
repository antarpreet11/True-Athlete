import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Home";
import Search from "./Search";
import { Root } from "./Root";
import Qr from "./Qr";
import Connections from "./Connections";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/qr",
        element: <Qr />,
      },
      {
        path: "/connections",
        element: <Connections />,
      },
      {
        path: "/search",
        element: <Search />,
      }
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
