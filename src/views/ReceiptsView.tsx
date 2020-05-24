import React from "react"

import { Formik, ErrorMessage, Field } from "formik"
import { Link } from "react-router-dom"

import { AppContext } from "../AppContext"
import { SubmitButton } from "../components"

export const ReceiptsView: React.FC = () => {
  return (
    <AppContext.Consumer>
      {({ apiKey, setAPIKey }) => (
        <Formik
          initialValues={{ receiptGuid: "" }}
          validate={(values) => {
            const errors = {} as any
            if (!values.receiptGuid) {
              errors.receiptGuid = "Required"
            }
            return errors
          }}
          onSubmit={(values) => {
            console.log("Values", values)
            console.log("API KEY", apiKey, "from receipts")
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                <svg className="bi bi-arrow-left-short" width="1.6em" height="1.6em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <Link to="/">
                    <path fillRule="evenodd" d="M7.854 4.646a.5.5 0 0 1 0 .708L5.207 8l2.647 2.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z" />
                    <path fillRule="evenodd" d="M4.5 8a.5.5 0 0 1 .5-.5h6.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z" />
                  </Link>
                </svg>
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
      )}
    </AppContext.Consumer>
  )
}
