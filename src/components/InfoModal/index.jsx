import React from "react"

import { Link } from "../../utils"
import Modal from "../Modal"

export default function InfoModal(props) {
  const { setPausedFromModal, setIsPlaying, setModalOpen } = props
  return (
    <Modal
      setModalOpen={setModalOpen}
      setPausedFromModal={setPausedFromModal}
      setIsPlaying={setIsPlaying}
      title={"Chaos Equations"}
    >
      <p>
        Real time visualization and animation of dynamic chaos equations.
      </p>
      <p>
        Iterates the positions of 800 points via a simple iterative
        calculation with a single parameter - time (t). Based on the equations{" "}
        <Link href="https://github.com/HackerPoet/Chaos-Equations">discovered by HackerPoet</Link>.
      </p>
      <p>
        My source code is <Link href="https://github.com/acarl005/chaos-equations-js">here</Link>.
        This implementation is forked from one written by Jered Danielson.
        More information and source code is available{" "}
        <Link href="https://glitch.com/edit/#!/chaos-equations?path=README.md:1:0">here</Link>
        .
      </p>
      <h3 className="modal-subheading">Controls:</h3>
      <p>
        Set the 6-letter equation parameter code in the upper left of the
        page.
      </p>
      <p>
        Click, drag, and zoom with the mouse to control position and scale.
      </p>
      <p>
        Control play, pause, and transport with the bottom buttons and
        timeline.
      </p>
      <p>
        Open 'Settings' on the left for more advanced features like repeat
        mode, time factor, color wheel, etc.
      </p>
    </Modal>
  )
}
