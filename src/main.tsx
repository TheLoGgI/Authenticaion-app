import "./index.css"

import { ChakraProvider, Heading } from "@chakra-ui/react"
import { Login, SignUp } from "./routes/"
import { RouterProvider, createHashRouter } from "react-router-dom"

import App from "./App"
import React from "react"
import { createRoot } from "react-dom/client"

const container = document.getElementById("root")
const root = createRoot(container!) // createRoot(container!) if you use TypeScript

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Heading>Page not Found</Heading>,
    children: [
      {
        path: "/",
        element: <Heading>Landing Page</Heading>,
      },
      {
        path: "/private/data",
        element: <Heading>Private data</Heading>,
      },
      {
        path: "/public/data",
        element: <Heading>Public data</Heading>,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <SignUp />,
      },
    ],
  },
])

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)
