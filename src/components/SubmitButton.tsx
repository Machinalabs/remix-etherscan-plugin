import React from "react"

interface Props {
    text: string
}

export const SubmitButton: React.FC<Props> = ({ text }) => {
    return (
        <button style={{ padding: "0.25rem 0.4rem" }} type="submit" className="btn btn-primary">
            {text}
        </button>
    )
}