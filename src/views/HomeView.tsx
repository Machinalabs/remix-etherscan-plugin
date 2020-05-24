import React, { useEffect, useState } from "react"

import { createIframeClient } from "@remixproject/plugin"
import { Redirect } from "react-router-dom"

import { VerifyView } from "./VerifyView"
import { AppContext } from "../AppContext"

const devMode = { port: 8080 }

export const HomeView: React.FC = () => {
  const [clientInstance, setClientInstance] = useState(undefined as any)
  // const [hasError, setHasError] = useState(false)

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
    <AppContext.Consumer>
      {({ apiKey }) =>
        !apiKey ? (
          <Redirect
            to={{
              pathname: "/settings",
              state: { from: "/" },
            }}
          />
        ) : (
            <VerifyView client={clientInstance} apiKey={apiKey} />
          )
      }
    </AppContext.Consumer>
  )
}
