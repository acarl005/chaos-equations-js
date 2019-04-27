import React from "react"

export default function Slider(props) {
  const { min, max, step, value, onChange } = props
  return (
    <div className="slider-container">
      <input
        type="range"
        style={{ width: "129px" }}
        {...{ min, max, step, value, onChange }}
      />
      <span style={{ marginLeft: "0.5rem" }}>{props.children}</span>
    </div>
  )
}
