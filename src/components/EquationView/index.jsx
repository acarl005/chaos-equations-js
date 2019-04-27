import React from "react"
import { paramsDimensions, paramsTerms } from "../../classes/ParametricFunction"

function pushEquTerm(elements, term, coef) {
  const termDisplay = term[0] !== term[1] ? term : <span>{term[0]}<sup>2</sup></span>
  if (coef !== 0) {
    let span
    if (elements.length === 0) {
      span = coef > 0 ? termDisplay : <span>-{termDisplay}</span>
    } else {
      span = <span>{coef > 0 ? " + " : " - "}{termDisplay}</span>
    }
    elements.push(span)
  }
}

export default function ParamEquation(props) {
  const { params } = props
  const paramsEquations = {}
  for (let dim of paramsDimensions) {
    const equation = paramsEquations[dim] = []
    for (let term of paramsTerms) {
      pushEquTerm(
        equation,
        term,
        params.params[dim][term]
      )
    }
    if (equation.length === 0) {
      equation.push("0")
    }
  }
  return (
    <div className="param-equ-container">
      <div className="param-equ-row">
        x' = <span>{paramsEquations.x}</span>
      </div>
      <div className="param-equ-row">
        y' = <span>{paramsEquations.y}</span>
      </div>
    </div>
  )
}
