import React from "react"
import { PluginApi, IRemixApi, Api, PluginClient } from "@remixproject/plugin"

import { Receipt } from './types'

export const AppContext = React.createContext({
  apiKey: "",
  setAPIKey: (value: string) => {
    console.log("Set API Key from Context")
  },
  clientInstance: {} as PluginApi<Readonly<IRemixApi>> &
    PluginClient<Api, Readonly<IRemixApi>>,
  receipts: [] as Receipt[],
  setReceipts: (receipt: Receipt[]) => {
    console.log("Calling Set Receipts")
  }
})
