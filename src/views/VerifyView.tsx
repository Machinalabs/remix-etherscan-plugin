import React from "react"

import { Formik, ErrorMessage, Field } from 'formik';

interface Props {
    onEditClick: () => void
}

export const VerifyView: React.FC<Props> = ({ onEditClick }) => {
    const onVerifyContract = () => {
        console.log("On Verify Contract Clicked")
        // TODO
    }

    return (
        <Formik
            initialValues={{ contractName: '', contractArguments: '', contractAddress: '' }}
            validate={values => {
                const errors = {} as any;
                if (!values.contractName) {
                    errors.contractName = 'Required';
                }
                if (!values.contractArguments) {
                    errors.contractArguments = 'Required';
                }
                if (!values.contractAddress) {
                    errors.contractAddress = 'Required';
                }
                return errors;
            }}
            onSubmit={(values) => {
                console.log("Values", values)
                // TODO
            }}>
            {({ errors, touched, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <div style={{ float: "right" }}>
                        <svg onClick={() => {
                            console.log("Icon clicked")
                            // Set is in EditMode

                            onEditClick()
                        }} className="bi bi-gear-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 0 0-5.86 2.929 2.929 0 0 0 0 5.858z" />
                        </svg>
                    </div>
                    <div className="form-group">
                        <label htmlFor="contractName">Contract Name</label>

                        <Field
                            className={(errors.contractName && touched.contractName) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            name="contractName"
                            placeholder="i.e. Ballot" />
                        {/* <input
                            className={(errors.contractName && touched.contractName) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contractName}
                            name="contractName"
                            placeholder="i.e. Ballot" /> */}
                        <ErrorMessage className="invalid-feedback" name="contractName" component="div" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contractArguments">Constructor Arguments</label>
                        <Field
                            className={(errors.contractArguments && touched.contractArguments) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            name="contractArguments"
                            placeholder="hex encoded" />
                        {/* <input
                            className={(errors.contractArguments && touched.contractArguments) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contractArguments}
                            name="contractArguments"
                            placeholder="hex encoded" /> */}
                        <ErrorMessage className="invalid-feedback" name="contractArguments" component="div" />
                    </div>

                    <div className="form-group">
                        <label htmlFor="contractAddress">Contract Address</label>
                        <Field
                            className={(errors.contractAddress && touched.contractAddress) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            name="contractAddress"
                            placeholder="i.e. 0x11b79afc03baf25c631dd70169bb6a3160b2706e" />
                        {/* <input
                            className={(errors.contractAddress && touched.contractAddress) ? "form-control form-control-sm is-invalid" : "form-control form-control-sm"}
                            type="text"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.contractAddress}
                            name="contractAddress"
                            placeholder="i.e. 0x11b79afc03baf25c631dd70169bb6a3160b2706e" /> */}
                        <ErrorMessage className="invalid-feedback" name="contractAddress" component="div" />
                    </div>

                    <button type="submit" className="btn btn-lg btn-secondary">Verify Contract</button>
                </form>
            )}
        </Formik>
    )
}