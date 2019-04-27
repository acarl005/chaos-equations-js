import React, { useEffect } from "react"

const ESC_KEY = 27

export default function ControlMessage(props) {
  const handleEsc = e => {
    if (e.keyCode === ESC_KEY) {
      props.setShowControls(bool => !bool)
    }
  }
  useEffect(() => {
    document.addEventListener("keydown", handleEsc)
    return () => {
      document.removeEventListener("keydown", handleEsc)
    }
  }, [props.showControls])

  return (
    <p className="fade-out control-msg">
      To show the controls, press the Esc key.
    </p>
  )
}
