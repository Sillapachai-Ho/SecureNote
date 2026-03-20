import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Sign_in from "./pages/Sign_in.jsx";
import Sign_up from "./pages/Sign_up.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: "/sign-in",
    element: <Sign_in />,
  },
  {
    path: "/sign-up",
    element: <Sign_up />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
