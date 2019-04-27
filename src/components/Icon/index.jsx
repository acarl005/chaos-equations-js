import React from "react"

export default function Icon(props) {
  return (
    <button
      className="chaos-icon"
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  )
}
