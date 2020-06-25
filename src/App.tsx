import React, { useState, useEffect, useRef } from "react"

import { createIframeClient, CompilationFileSources, CompilationResult } from "@remixproject/plugin"

import { AppContext } from "./AppContext"
import { Routes } from "./routes"

import { useLocalStorage } from "./hooks/useLocalStorage"

import { getReceiptStatus, getEtherScanApi, getNetworkName } from "./utils"
import { Receipt, Contract } from "./types"

import "./App.css"

const devMode = { port: 8080 }

export const getNewContracts = (compilationResult: CompilationResult) => {
  const compiledContracts = compilationResult.contracts
  let result: Contract[] = []

  for (const file of Object.keys(compiledContracts)) {
    const newContractNames = Object.keys(compiledContracts[file])
    const newContracts = newContractNames.map((item) => {
      const result: Contract = {
        name: item
      }
      return result
    })
    result = [...result, ...newContracts]
  }

  return result
}


const App = () => {
  const [apiKey, setAPIKey] = useLocalStorage("apiKey", "")
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [receipts, setReceipts] = useLocalStorage("receipts", [])
  const [contracts, setContracts] = useLocalStorage("available-contracts", [])
  const clientInstanceRef = useRef(clientInstance)
  clientInstanceRef.current = clientInstance

  useEffect(() => {
    console.log("Remix Etherscan loading...")
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)
      console.log("Remix Etherscan Plugin has been loaded")

      client.solidity.on('compilationFinished', (fileName: string, source: CompilationFileSources, languageVersion: string, data: CompilationResult) => {
        console.log("New compilation received")
        const newContracts = getNewContracts(data)

        const newContractsToSave = [
          ...contracts,
          ...newContracts
        ]

        setContracts(newContractsToSave)
      })
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
  }, [receipts, clientInstance, apiKey, setReceipts])

  return (
    <AppContext.Provider
      value={{ apiKey, setAPIKey, clientInstance, receipts, setReceipts, contracts, setContracts }}>
      <Routes />
    </AppContext.Provider>
  )
}

export default App
