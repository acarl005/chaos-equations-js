import { EventEmitter } from "events"

// this is basically a custom state manager for the time variable only.
// this variable changes every frame, so having it live in React state
// will kill performance. Trying to add `shouldComponentUpdate` all over
// the place quickly makes the code unmaintainable. The solution is to
// store time in here and have only the components that need to depend
// on time manually subscribe to this
export default class TimeKeeper extends EventEmitter {
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
