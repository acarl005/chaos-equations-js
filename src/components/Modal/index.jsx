import React from "react"
import Icon from "../Icon"

const ESC_KEY = 27

export default class Modal extends React.Component {
  handleClose = e => {
    const { setModalOpen, setPausedFromModal, setIsPlaying } = this.props
    this.props.onClose && this.props.onClose(e)
    setPausedFromModal(pausedFromModal => {
      if (pausedFromModal) {
        setIsPlaying(true)
      }
      return false
    })
    setModalOpen("none")
  }
  handleEsc = e => {
    if (e.keyCode === ESC_KEY) {
      this.handleClose()
    }
  }
  componentDidMount() {
    document.addEventListener("keydown", this.handleEsc)
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEsc)
  }
  render() {
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
          onClick={this.handleClose}
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
            <h2>{this.props.title}</h2>
            <Icon onClick={this.handleClose} style={{ fontSize: "16px" }}>
              <span className="icon-cross" />
            </Icon>
          </div>
          <div>{this.props.children}</div>
        </div>
      </div>
    )
  }
}
