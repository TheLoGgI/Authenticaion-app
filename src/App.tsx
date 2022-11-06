import "./App.css"

import { Header, Layout } from "./components"
import { createContext, useContext, useEffect, useState } from "react"

import { Outlet } from "react-router-dom"

const AppContext = createContext({
  feedbackBehavior: "bad",
  isDevelopment: true,
})

type User = {
  username: string
  uid: string
  validated: boolean
}

type AuthContextType = { user: User | null; signout: (() => void) | null }

const AuthContext = createContext<AuthContextType>({
  user: null,
  signout: null,
})

function useProvideAuth(): AuthContextType {
  const sessionId = sessionStorage.getItem("sessionId") || ""

  const [uid, maxAge, username] = atob(sessionId).split(":")

  const [user, setUser] = useState<User | null>({
    username,
    uid,
    validated: new Date().getTime() / 1000 < Number(maxAge),
  })

  // const signin = cb => {
  //   return fakeAuth.signin(() => {
  //     setUser("user");
  //     cb();
  //   });
  // };

  const signout = () => {
    setUser(null)
    sessionStorage.removeItem("sessionId")
  }

  return {
    user,
    // signin,
    signout,
  }
}

export const useAuthContext = (): AuthContextType => {
  return useContext<AuthContextType>(AuthContext)
}

function App() {
  const auth = useProvideAuth()
  console.log("auth: ", auth)
  return (
    <AuthContext.Provider value={auth}>
      <Header /* context={contextState} */ />
      <Layout>
        <Outlet context={AppContext} />
      </Layout>
    </AuthContext.Provider>
  )
}

export default App
