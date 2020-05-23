import React from 'react';

import { AppContext } from './AppContext'
import { Routes } from './routes';

import './App.css';

const App = () => {
  const setAPIKey = () => {

  }
  return (
    // <AppContext.Provider value={{ apiKey: "123", setAPIKey }}>
    <Routes />
    // </AppContext.Provider>
  );
}

export default App;
