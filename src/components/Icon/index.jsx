import React from "react"

export default function Icon(props) {
  return (
    <button
      className="clickable-icon"
      onClick={props.onClick}
      style={props.style}
    >
      {props.children}
    </button>
  )
}
