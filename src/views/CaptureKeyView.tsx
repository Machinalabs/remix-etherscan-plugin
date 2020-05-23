import React from "react"

import { Formik, ErrorMessage, Field } from 'formik';

interface Props {
    onSaveAPIKey: (value: string) => void
}

export const CaptureKeyView: React.FC<Props> = ({ onSaveAPIKey }) => {
    return (
        <Formik
            initialValues={{ apiKey: '' }}
            validate={values => {
                const errors = {} as any;
                if (!values.apiKey) {
                    errors.apiKey = 'Required';
                }
                return errors;
            }}
            onSubmit={(values) => {
                console.log("Values", values)
                onSaveAPIKey(values.apiKey)
            }}>
            {({ errors, touched, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: "0.5rem" }}>
                        <label htmlFor="apikey">Please Enter your API key</label>
                        <Field
                            className={(errors.apiKey && touched.apiKey) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            name="apiKey"
                            placeholder="Example: GM1T20XY6JGSAPWKDCYZ7B2FJXKTJRFVGZ" />
                        <ErrorMessage className="invalid-feedback" name="apiKey" component="div" />
                    </div>

                    <button type="submit" className="btn btn-sm btn-primary">Save API key</button>
                </form>
            )}
        </Formik>)
}