import React from "react"
import { PluginApi, IRemixApi, Api, PluginClient } from "@remixproject/plugin"

export const AppContext = React.createContext({
  apiKey: "",
  setAPIKey: (value: string) => {
    console.log("Set API Key from Context")
  },
  clientInstance: {} as PluginApi<Readonly<IRemixApi>> &
    PluginClient<Api, Readonly<IRemixApi>>,
})
