import React from "react"
import Modal from "../Modal"

export default class ParamModal extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault()
    const newParams = e.target.params.value.toUpperCase()
    this.props.onSave(newParams)
  }
  componentDidMount() {
    this.refs.params.focus()
  }
  render() {
    const { paramsString, setPausedFromModal, setIsPlaying, setModalOpen } = this.props
    return (
      <Modal
        setModalOpen={setModalOpen}
        setPausedFromModal={setPausedFromModal}
        setIsPlaying={setIsPlaying}
        title={"Edit Parameters"}
      >
        <form className="param-form" onSubmit={this.handleSubmit}>
          <input
            type="text"
            id="params"
            ref="params"
            defaultValue={paramsString}
            required
            pattern="[A-Za-z_]{6}"
          />
          <label className="floating-label">6-letter code</label>
          <button className="param-button">Save</button>
        </form>
      </Modal>
    )
  }
}
