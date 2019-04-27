import React, { useState } from "react"
import SquareButton from "../SquareButton"
import TextInput from "../TextInput"
import Icon from "../Icon"

export default function EditableValue(props) {
  const { setModalOpen, setIsPlaying, setPausedFromModal, isPlaying } = props

  return (
    <div style={{ padding: "0.5rem 1rem", fontSize: "1.5rem" }}>
      Code: {props.value}
      <Icon
        onClick={() => {
          setModalOpen("param")
          setIsPlaying(false)
          if (isPlaying) {
            setPausedFromModal(true)
          }
        }}
        style={{ marginLeft: "10px" }}
      >
        <span className="icon-pencil" />
      </Icon>
    </div>
  )
}

