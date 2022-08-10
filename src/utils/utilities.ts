import { PluginClient } from "@remixproject/plugin"
import axios from "axios"
import { EtherscanAPIurls } from "./networks"
type RemixClient = PluginClient

export const getEtherScanApi = (network: string, networkId: any) => {
  let apiUrl

  if (network === "main") {
    apiUrl = "https://api.etherscan.io/api"
  } else if (network === "custom") {
    if (!(networkId in EtherscanAPIurls)) {
      throw new Error("no known network to verify against")
    }
    apiUrl = (EtherscanAPIurls as any)[networkId]
  } else {
    apiUrl = `https://api-${network}.etherscan.io/api`
  }

  return apiUrl
}

export const getNetworkName = async (client: RemixClient) => {
  const network = await client.call("network", "detectNetwork")

  if (!network) {
    throw new Error("no known network to verify against")
  }
  const name = network.name!.toLowerCase()

  const id = network.id

  return { network: name, networkId: id }
}

export const getReceiptStatus = async (
  receiptGuid: string,
  apiKey: string,
  etherscanApi: string
) => {
  const params = `guid=${receiptGuid}&module=contract&action=checkverifystatus&apiKey=${apiKey}`
  try {
    const response = await axios.get(`${etherscanApi}?${params}`)
    const { result } = response.data
    return result
  } catch (error) {
    console.log("Error", error)
  }
}
