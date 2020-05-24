import React, { useState } from "react"

import { Formik, ErrorMessage, Field } from "formik"
import { PluginApi, IRemixApi, PluginClient, Api } from "@remixproject/plugin"
import { Link } from "react-router-dom"

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
    // TODO
    console.log("On Verify Contract Clicked")

    // console.log("Props API Key", apiKey)

    const compilationResult = (await client.call(
      "solidity",
      "getCompilationResult"
    )) as any

    console.log("Compilation results")

    if (!compilationResult) throw new Error("no compilation result available") // TODO handle better, create a logger and a submit issue button
    // that captures the error and send directly to my dashboard...

    setResults("Verifying contract. Please wait...")

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
        if (message === "OK" && status === "1") {
          // TODO
          // checkValidation(etherscanApi, result)
          // scheduleResetStatus()
        }
        if (message === "NOTOK") {
          client.emit("statusChanged", {
            key: "failed",
            type: "error",
            title: result,
          })
          // scheduleResetStatus()
        }
        return result
      } catch (error) {
        // document.querySelector('div#results').innerText = error
        setResults(error)
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

    const verificationResult = await verify(
      apiKey,
      values.contractAddress,
      contractArguments,
      values.contractName,
      compilationResult
    )

    console.log("Verification result", verificationResult)
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
          if (!values.contractArguments) {
            errors.contractArguments = "Required"
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
        {({ errors, touched, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
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

            <button
              type="submit"
              className="btn btn-secondary"
              style={{ padding: ".175rem 0.6rem" }}
            >
              Verify Contract
            </button>
          </form>
        )}
      </Formik>

      <div id="results">{results}</div>

      <div style={{ display: "block", textAlign: "center", marginTop: "2em" }}>
        <Link to="/receipts">View Receipts</Link>
      </div>
    </div>
  )
}
