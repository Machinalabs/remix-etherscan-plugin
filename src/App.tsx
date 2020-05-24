import React from 'react';

import { AppContext } from './AppContext'
import { Routes } from './routes';

import { useLocalStorage } from './hooks/useLocalStorage'

import './App.css';

const App = () => {
  const [apiKey, setAPIKey] = useLocalStorage("apiKey", "")

  return (
    <AppContext.Provider value={{ apiKey, setAPIKey }}>
      <Routes />
    </AppContext.Provider>
  );
}

export default App;
