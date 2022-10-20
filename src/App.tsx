import "./App.css"

import { Header, Layout } from "./components"
import { createContext, useContext, useEffect, useState } from "react"

import { Outlet } from "react-router-dom"

const AppContext = createContext({
  feedbackBehavior: "bad",
  isDevelopment: true
})

function App() {
  const contextState = useState(AppContext)
  console.log("contextState: ", contextState)

  return (
    <>
      <Header /* context={contextState} */ />
      <Layout>
        <Outlet context={contextState} />
      </Layout>
    </>
  )
}

export default App
