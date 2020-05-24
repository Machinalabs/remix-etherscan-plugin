import React, { useState } from "react"

import { PluginApi, IRemixApi, PluginClient, Api } from "@remixproject/plugin"
import { Formik, ErrorMessage, Field } from "formik"
import { Link } from "react-router-dom"

import { SubmitButton } from "../components"

interface Props {
  client: PluginApi<Readonly<IRemixApi>> &
  PluginClient<Api, Readonly<IRemixApi>>
  apiKey: string
}

interface FormValues {
  contractName: string
  contractArguments: string
  contractAddress: string
}

export const VerifyView: React.FC<Props> = ({ apiKey, client }) => {
  const onVerifyContract = async (values: FormValues) => {
    const compilationResult = (await client.call(
      "solidity",
      "getCompilationResult"
    )) as any

    console.log("Compilation results", compilationResult)

    if (!compilationResult) {
      throw new Error("no compilation result available")
    }// TODO handle better, Maybe create a logger and a submit issue button that captures the error and send directly to my dashboard...

    const contractArguments = values.contractArguments.replace("0x", "")

    const verify = async (
      apiKeyParam: string,
      contractAddress: string,
      contractArgumentsParam: string,
      contractName: string,
      compilationResultParam: any
    ) => {
      const network = await getNetworkName()

      const fileName = compilationResultParam.source.target // Check if it is not empty

      console.log("Filename", fileName)

      const contractMetadata =
        compilationResultParam.data.contracts[fileName][contractName].metadata
      const contractMetadataParsed = JSON.parse(contractMetadata)

      const etherscanApi =
        network === "main"
          ? `https://api.etherscan.io/api`
          : `https://api-${network}.etherscan.io/api`

      const data: { [key: string]: string | any } = {
        apikey: apiKeyParam, // A valid API-Key is required
        module: "contract", // Do not change
        action: "verifysourcecode", // Do not change
        contractaddress: contractAddress, // Contract Address starts with 0x...
        sourceCode: compilationResultParam.source.sources[fileName].content, // Contract Source Code (Flattened if necessary)
        contractname: contractName,
        compilerversion: `v${contractMetadataParsed.compiler.version}`, // see http://etherscan.io/solcversions for list of support versions
        optimizationUsed: contractMetadataParsed.settings.optimizer.enabled
          ? 1
          : 0, // 0 = Optimization used, 1 = No Optimization
        runs: contractMetadataParsed.settings.optimizer.runs, // set to 200 as default unless otherwise
        constructorArguements: contractArgumentsParam, // if applicable
      }

      const body = new FormData()
      Object.keys(data).forEach((key) => body.append(key, data[key]))

      try {
        client.emit("statusChanged", {
          key: "loading",
          type: "info",
          title: "Verifying ...",
        })
        const response = await fetch(etherscanApi, { method: "POST", body })
        const { message, result, status } = await response.json()
        console.log("Message returned", message, result, status)
        if (message === "OK" && status === "1") {
          scheduleResetStatus()
          return `Contract verified correctly <br> Receipt GUID ${result}`
        }
        if (message === "NOTOK") {
          client.emit("statusChanged", {
            key: "failed",
            type: "error",
            title: result,
          })
          scheduleResetStatus()
        }
        return result
      } catch (error) {
        console.log("Error, something wrong happened", error)
        setResults("Something wrong happened, try again")
      }
    }

    const getNetworkName = async () => {
      const network = await client.call("network", "detectNetwork")
      if (!network) {
        throw new Error("no known network to verify against")
      }
      const name = network.name!.toLowerCase()
      // TODO : remove that when https://github.com/ethereum/remix-ide/issues/2017 is fixed
      return name === "görli" ? "goerli" : name
    }

    /** Reset the status of the plugin to none after 10sec */
    const scheduleResetStatus = () => {
      setTimeout(() => {
        client.emit('statusChanged', { key: 'none' })
      }, 10000)
    }

    const verificationResult = await verify(
      apiKey,
      values.contractAddress,
      contractArguments,
      values.contractName,
      compilationResult
    )

    console.log("Verification result", verificationResult)

    setResults(verificationResult)
  }

  const [results, setResults] = useState("")

  return (
    <div>
      <Formik
        initialValues={{
          contractName: "",
          contractArguments: "",
          contractAddress: "",
        }}
        validate={(values) => {
          const errors = {} as any
          if (!values.contractName) {
            errors.contractName = "Required"
          }
          if (!values.contractAddress) {
            errors.contractAddress = "Required"
          }
          if (values.contractAddress.trim() === "") {
            errors.contractAddress = "Please enter a valid contract address"
          }
          return errors
        }}
        onSubmit={(values) => onVerifyContract(values)}
      >
        {({ errors, touched, handleSubmit, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <h6>Verify your smart contracts</h6>
              <label htmlFor="contractName">Contract Name</label>
              <Field
                className={
                  errors.contractName && touched.contractName
                    ? "form-control form-control-sm is-invalid"
                    : "form-control form-control-sm"
                }
                type="text"
                name="contractName"
                placeholder="i.e. Ballot"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="contractName"
                component="div"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contractArguments">Constructor Arguments</label>
              <Field
                className={
                  errors.contractArguments && touched.contractArguments
                    ? "form-control form-control-sm is-invalid"
                    : "form-control form-control-sm"
                }
                type="text"
                name="contractArguments"
                placeholder="hex encoded"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="contractArguments"
                component="div"
              />
            </div>

            <div className="form-group">
              <label htmlFor="contractAddress">Contract Address</label>
              <Field
                className={
                  errors.contractAddress && touched.contractAddress
                    ? "form-control form-control-sm is-invalid"
                    : "form-control form-control-sm"
                }
                type="text"
                name="contractAddress"
                placeholder="i.e. 0x11b79afc03baf25c631dd70169bb6a3160b2706e"
              />
              <ErrorMessage
                className="invalid-feedback"
                name="contractAddress"
                component="div"
              />
            </div>

            <SubmitButton text="Verify Contract" isSubmitting={isSubmitting} />

          </form>
        )}
      </Formik>

      <div style={{ marginTop: "2em", fontSize: "0.8em", textAlign: "center" }}
        dangerouslySetInnerHTML={{ __html: results }} />

      <div style={{ display: "block", textAlign: "center", marginTop: "1em" }}>
        <Link to="/receipts">View Receipts</Link>
      </div>
    </div>
  )
}