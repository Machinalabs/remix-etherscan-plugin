import React from "react"

import { Redirect } from "react-router-dom"

import { VerifyView } from "./VerifyView"
import { AppContext } from "../AppContext"


export const HomeView: React.FC = () => {
  // const [hasError, setHasError] = useState(false)
  return (
    <AppContext.Consumer>
      {({ apiKey, clientInstance }) =>
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
