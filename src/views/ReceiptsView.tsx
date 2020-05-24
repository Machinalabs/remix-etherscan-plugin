import React, { useState } from "react"

import { Formik, ErrorMessage, Field } from "formik"
import { Link } from "react-router-dom"

import { AppContext } from "../AppContext"
import { SubmitButton } from "../components"
import { getEtherScanApi, getNetworkName } from "../utils"

interface FormValues {
  receiptGuid: string
}

export const ReceiptsView: React.FC = () => {
  const [results, setResults] = useState("")
  const onGetReceiptStatus = async (
    values: FormValues,
    clientInstance: any,
    apiKey: string
  ) => {
    try {
      const network = await getNetworkName(clientInstance)
      const etherscanApi = getEtherScanApi(network)
      const params = `guid=${values.receiptGuid}&module=contract&action=checkverifystatus&apiKey=${apiKey}`
      const response = await fetch(`${etherscanApi}?${params}`, {
        method: "GET",
      })
      const { message, result } = await response.json()
      console.log("Message", message)
      setResults(result)
    } catch (error) {
      setResults(error.message)
    }
  }

  return (
    <AppContext.Consumer>
      {({ apiKey, clientInstance }) => (
        <div>
          <Formik
            initialValues={{ receiptGuid: "" }}
            validate={(values) => {
              const errors = {} as any
              if (!values.receiptGuid) {
                errors.receiptGuid = "Required"
              }
              return errors
            }}
            onSubmit={(values) =>
              onGetReceiptStatus(values, clientInstance, apiKey)
            }
          >
            {({ errors, touched, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                  <h6>Get your Receipt GUID status</h6>
                  <label htmlFor="receiptGuid">Receipt GUID</label>
                  <Field
                    className={
                      errors.receiptGuid && touched.receiptGuid
                        ? "form-control form-control-sm is-invalid"
                        : "form-control form-control-sm"
                    }
                    type="text"
                    name="receiptGuid"
                  />
                  <ErrorMessage
                    className="invalid-feedback"
                    name="receiptGuid"
                    component="div"
                  />
                </div>

                <SubmitButton text="Check" />
              </form>
            )}
          </Formik>

          <div
            style={{ marginTop: "2em", fontSize: "0.8em", textAlign: "center" }}
            dangerouslySetInnerHTML={{ __html: results }}
          />

          <div
            style={{ display: "block", textAlign: "center", marginTop: "1em" }}
          >
            <Link to="/">Go back</Link>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  )
}
