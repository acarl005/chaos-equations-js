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
      <div className="modal-mask" >
        <div className="model-close-membrane" onClick={this.handleClose} />
        <div className="modal-content">
          <div className="modal-head" >
            <h2>{this.props.title}</h2>
            <Icon onClick={this.handleClose} style={{ fontSize: "16px" }}>
              <span className="icon-cross" />
            </Icon>
          </div>
          <div className="modal-body">{this.props.children}</div>
        </div>
      </div>
    )
  }
}
