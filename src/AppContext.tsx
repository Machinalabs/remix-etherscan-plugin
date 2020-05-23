import React from "react";

export const AppContext = React.createContext({
    apiKey: "",
    setAPIKey: () => {
        console.log("Set API Key from Context")
    },
    isInitialized: false,
    setIsInitialized: () => {
        console.log("Set isInitialized from Context")
    }
});