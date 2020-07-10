import React from "react"

import { Formik, ErrorMessage, Field } from "formik"
import { useHistory, useLocation } from "react-router-dom"

import { AppContext } from "../AppContext"
import { SubmitButton } from "../components"

interface Props {
  onClick: any
}
const CancelButton: React.FC<Props> = (props) => {
  return (
    <button {...props} style={{ padding: "0.25rem 0.4rem", width: "7em" }}
      className="btn btn-danger">Cancel</button>
  )
}

export const CaptureKeyView: React.FC = () => {
  const location = useLocation()
  const history = useHistory()
  return (
    <AppContext.Consumer>
      {({ apiKey, setAPIKey }) => (
        <Formik
          initialValues={{ apiKey }}
          validate={(values) => {
            const errors = {} as any
            if (!values.apiKey) {
              errors.apiKey = "Required"
            }
            return errors
          }}
          onSubmit={(values) => {
            setAPIKey(values.apiKey)
            history.push((location.state as any).from)
          }}
        >
          {({ errors, touched, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                <label htmlFor="apikey">Please Enter your API key</label>
                <Field
                  className={
                    errors.apiKey && touched.apiKey
                      ? "form-control form-control-sm is-invalid"
                      : "form-control form-control-sm"
                  }
                  type="text"
                  name="apiKey"
                  placeholder="Example: GM1T20XY6JGSAPWKDCYZ7B2FJXKTJRFVGZ"
                />
                <ErrorMessage
                  className="invalid-feedback"
                  name="apiKey"
                  component="div"
                />
              </div>

              <div>
                <SubmitButton text="Save API key" />
                <CancelButton onClick={() => {
                  history.push((location.state as any).from)
                }} />
              </div>
            </form>
          )}
        </Formik>
      )}
    </AppContext.Consumer>
  )
}
