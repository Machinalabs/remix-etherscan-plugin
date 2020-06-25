import React from "react"
import { render } from "@testing-library/react"
import App, { getNewContractNames } from "./App"
import { CompilationResult, UserMethodList, BytecodeObject, UserDocumentation, DeveloperDocumentation } from "@remixproject/plugin"

test('getNewContracts', () => {
  const fakeCompilationResult: CompilationResult = {
    "sources": {} as any,
    "contracts":
    {
      "browser/SafeMath.sol":
      {
        "SafeMath":
        {
          abi: [],
          metadata: "",
          devdoc: {} as DeveloperDocumentation,
          userdoc: {} as UserDocumentation,
          ir: "",
          evm: {} as any,
          ewasm: {} as any
        }
      }
    }
  }

  const result = getNewContractNames(fakeCompilationResult)

  expect(result).toHaveLength(1)
  expect(result[0]).toEqual("SafeMath")
})

