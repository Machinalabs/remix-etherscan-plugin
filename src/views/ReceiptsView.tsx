import React from "react"

import { Formik, ErrorMessage, Field } from "formik"
import { AppContext } from "../AppContext"

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

              <button type="submit" className="btn btn-sm btn-primary">
                Check
              </button>
            </form>
          )}
        </Formik>
      )}
    </AppContext.Consumer>
  )
}
