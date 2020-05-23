import React, { useEffect, useState } from "react"

import { createIframeClient } from "@remixproject/plugin"

import { useLocalStorage } from '../hooks/useLocalStorage'
import { CaptureKeyView } from './CaptureKeyView'
import { VerifyView } from './VerifyView'

const devMode = { port: 8080 }

export const HomeView: React.FC = () => {
  const [clientInstance, setClientInstance] = useState(undefined as any)
  const [isInEditMode, setIsInEditMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [hasError, setHasError] = useState(false)
  const [apiKey, setApiKey] = useLocalStorage("apiKey", "")

  useEffect(() => {
    console.log("Remix Etherscan loading...")

    if (apiKey) {
      setIsInitialized(true)
    }
    const client = createIframeClient({ devMode })
    const loadClient = async () => {
      await client.onload()
      setClientInstance(client)

      console.log("Remix Etherscan Plugin has been loaded")
    }

    loadClient()
  }, [])

  return (
    <div>
      {(!isInitialized || isInEditMode) ?
        <CaptureKeyView onSaveAPIKey={(value: string) => {
          setApiKey(value)
          setIsInitialized(true)
          setIsInEditMode(false)
        }} /> :
        <VerifyView onEditClick={() => {
          console.log("Click home view")
          setIsInEditMode(true)
        }} />
      }
    </div>
  )
}
