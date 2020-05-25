import React from "react"

import { Redirect } from "react-router-dom"

import { AppContext } from "../AppContext"
import { Receipt } from "../types"

import { VerifyView } from "./VerifyView"

export const HomeView: React.FC = () => {
  // const [hasError, setHasError] = useState(false)
  return (
    <AppContext.Consumer>
      {({ apiKey, clientInstance, setReceipts, receipts }) =>
        !apiKey ? (
          <Redirect
            to={{
              pathname: "/settings",
              state: { from: "/" },
            }}
          />
        ) : (
            <VerifyView
              client={clientInstance}
              apiKey={apiKey}
              onVerifiedContract={(receipt: Receipt) => {
                const newReceipts = [
                  ...receipts,
                  receipt
                ]

                setReceipts(newReceipts)
              }}
            />
          )
      }
    </AppContext.Consumer>
  )
}
