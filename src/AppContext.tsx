import React from "react"
import { PluginApi, IRemixApi, Api, PluginClient } from "@remixproject/plugin"

import { Receipt, Contract } from "./types"

export const AppContext = React.createContext({
  apiKey: "",
  setAPIKey: (value: string) => {
    console.log("Set API Key from Context")
  },
  clientInstance: {} as PluginApi<Readonly<IRemixApi>> &
    PluginClient<Api, Readonly<IRemixApi>>,
  receipts: [] as Receipt[],
  setReceipts: (receipts: Receipt[]) => {
    console.log("Calling Set Receipts")
  },
  contracts: [] as Contract[],
  setContracts: (contracts: Contract[]) => {
    console.log("Calling Set Contracts")
  },
})
