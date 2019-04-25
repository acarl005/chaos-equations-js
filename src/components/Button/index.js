import React from "react"

export default function Button(props) {
  return (
    <button
      className="chaos-button"
      alt={props.alt}
      onClick={props.onClick}
      style={{
        borderBottom: `1px solid rgba(255, 255, 255, ${props.active ? 1 : 0.5})`,
        fontWeight: props.active ? "bold" : "normal",
        ...props.style
      }}
    >
      {props.children}
    </button>
  )
}
