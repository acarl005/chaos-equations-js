import React from "react"
import { paramsDimensions, paramsTerms } from "../../classes/ParametricFunction"

function pushParamToken(strArr, varName, varValue) {
  const varNameComputed =
    varName.substr(0, 1) === varName.substr(1, 1) ? (
      <span>
        {varName.substr(0, 1)}
        <sup>2</sup>
      </span>
    ) : (
      varName
    )
  if (varValue !== 0) {
    strArr.push(
      <span key={varName}>
        {varValue > 0 ? (
          strArr.length === 0 ? (
            varNameComputed
          ) : (
            <span>
              {" + "}
              {varNameComputed}
            </span>
          )
        ) : strArr.length === 0 ? (
          <span>
            {"-"}
            {varNameComputed}
          </span>
        ) : (
          <span>
            {" - "}
            {varNameComputed}
          </span>
        )}
      </span>
    )
  }
}

export default function ParamEquation(props) {
  const { params } = props
  const paramsEquations = {}
  paramsDimensions.forEach(eaDimension => {
    paramsEquations[eaDimension] = []
    paramsTerms.forEach(eaParam => {
      pushParamToken(
        paramsEquations[eaDimension],
        eaParam,
        params.params[eaDimension][eaParam]
      )
    })
    if (paramsEquations[eaDimension].length === 0) {
      paramsEquations[eaDimension].push("0")
    }
  })
  return (
    <div className="param-equ-container">
      {Object.keys(paramsEquations).map((ea, i) => {
        return (
          <div key={`${ea}`} className="param-equ-row">
            {paramsDimensions[i]}' = <span>{paramsEquations[ea]}</span>
          </div>
        )
      })}
    </div>
  )
}
