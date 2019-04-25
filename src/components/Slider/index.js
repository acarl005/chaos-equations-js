import React from "react"

export default function Slider(props) {
  const { min, max, step, value, onChange } = props
  return (
    <div style={{ display: "flex", cursor: "pointer" }}>
      <input
        type="range"
        {...{ min, max, step, value, onChange }}
      />
      <span style={{ marginLeft: "0.5rem" }}>{props.children}</span>
    </div>
  )
}
