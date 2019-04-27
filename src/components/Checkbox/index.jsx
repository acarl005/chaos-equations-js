import React from "react"

export default function Checkbox(props) {
  return (
    <div className="check-container">
      <input type="checkbox" id={props.id} className="toggle-switch" checked={props.value} onChange={props.onChange}/>
      <label htmlFor={props.id} className="toggle-switch__button"></label>
      {props.children}
    </div>
  )
}
