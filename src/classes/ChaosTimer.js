import { EventEmitter } from "events"

export default class ChaosTimer extends EventEmitter {
  constructor(startTime) {
    super()
    this._t = startTime
    this.paused = false
  }

  get() {
    return this._t
  }

  set(t) {
    this._t = t
    this.emit("set", t)
  }

  pause() {
    this.paused = true
  }

  play() {
    this.paused = false
  }

  skip() {
    this.emit("skip", this._t)
  }
}
