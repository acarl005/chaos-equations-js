import React from "react"
import Icon from "../Icon"

export default function Modal(props) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, .5)",
          zIndex: 200,
        }}
        onClick={props.onClose}
      />
      <div
        style={{
          position: "relative",
          zIndex: 300,
          color: "white",
          width: 640,
          maxWidth: "100%",
          maxHeight: "100%",
          padding: "1rem",
          margin: "1rem",
          border: "1px solid rgba(255, 255, 255, 0.8)",
          background: "black",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <h2>{props.title}</h2>
          <Icon onClick={props.onClose} style={{ fontSize: "16px" }}>
            <span className="icon-cross" />
          </Icon>
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  )
}
