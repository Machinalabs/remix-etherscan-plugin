import React, { useState, useEffect } from "react"

import { createIframeClient } from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { useLocalStorage } from "./hooks/useLocalStorage"

import "./App.css"

const devMode = { port: 8080 }

const App = () => {
  const [apiKey, setAPIKey] = useLocalStorage("apiKey", "")
  const [clientInstance, setClientInstance] = useState(undefined as any)

  useEffect(() => {
    console.log("Remix Etherscan loading...")
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)
      console.log("Remix Etherscan Plugin has been loaded")
    }

    loadClient()
  }, [])

  return (
    <AppContext.Provider value={{ apiKey, setAPIKey, clientInstance }}>
      <Routes />
    </AppContext.Provider>
  )
}

export default App
