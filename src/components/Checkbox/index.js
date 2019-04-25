import React from "react"

export default function Checkbox(props) {
  return (
    <div className="check-container">
      <input type="checkbox" id={props.id} class="toggle-switch" value={props.value} onChange={props.onChange}/>
      <label for={props.id} class="toggle-switch__button"></label>
      {props.children}
    </div>
  )
}
