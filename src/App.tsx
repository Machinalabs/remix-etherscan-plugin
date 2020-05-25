import React, { useState, useEffect, useRef } from "react"

import { createIframeClient } from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { useLocalStorage } from "./hooks/useLocalStorage"

import { getReceiptStatus, getEtherScanApi, getNetworkName } from "./utils"
import { Receipt } from "./types"

import "./App.css"

const devMode = { port: 8080 }

const App = () => {
  const [apiKey, setAPIKey] = useLocalStorage("apiKey", "")
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [receipts, setReceipts] = useLocalStorage("receipts", [])
  const clientInstanceRef = useRef(clientInstance)
  clientInstanceRef.current = clientInstance

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

  useEffect(() => {
    if (!clientInstance) {
      return
    }

    const receiptsNotVerified: Receipt[] = receipts.filter((item: Receipt) => {
      return item.status !== "Verified"
    })

    if (receiptsNotVerified.length > 0) {
      let timer1 = setInterval(() => {
        receiptsNotVerified.forEach(async (item) => {
          if (!clientInstanceRef.current) {
            return
          }
          const network = await getNetworkName(clientInstanceRef.current)
          if (network === "vm") {
            return
          }
          const status = await getReceiptStatus(
            item.guid,
            apiKey,
            getEtherScanApi(network)
          )
          if (status === "Pass - Verified") {
            const newReceipts = receipts.map((currentReceipt: Receipt) => {
              if (currentReceipt.guid === item.guid) {
                return {
                  ...currentReceipt,
                  status: "Verified",
                }
              }
              return currentReceipt
            })

            clearInterval(timer1)

            setReceipts(newReceipts)

            return () => {
              clearInterval(timer1)
            }
          }
        })
      }, 5000)
    }
  }, [receipts, clientInstance])

  return (
    <AppContext.Provider
      value={{ apiKey, setAPIKey, clientInstance, receipts, setReceipts }}
    >
      <Routes />
    </AppContext.Provider>
  )
}

export default App
