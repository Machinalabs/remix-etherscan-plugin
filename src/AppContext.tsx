import React from "react";

export const AppContext = React.createContext({
    apiKey: "",
    setAPIKey: (value: string) => {
        console.log("Set API Key from Context")
    }
});