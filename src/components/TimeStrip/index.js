import React, { useEffect } from "react"
import Slider from '../Slider'

export default function TimeStrip(props) {
  const { tMin, tMax, chaosTimer } = props

  const [time, setTime] = React.useState(tMin)
  useEffect(() => {
    const handleSetTime = t => {
      setTime(t)
    }

    chaosTimer.on("set", setTime)

    return function cleanUp() {
      chaosTimer.removeListener("set", setTime)
    }
  }, [])
  const formattedTime = time.toFixed(4)
  const currentRatio = Math.abs(time - tMin) / (tMax - tMin)

  return (
    <div className="time-strip-container">
      <div className="time-strip-clock">t = {formattedTime}</div>
      <input
        type="range"
        className="time-strip-range"
        min={tMin}
        max={tMax}
        step="0.001"
        value={time}
        onInput={e => {
          e.preventDefault()
          chaosTimer.set(parseFloat(e.target.value))
          chaosTimer.skip()
        }}
        onMouseDown={e => {
          chaosTimer.pause()
        }}
        onMouseUp={e => {
          chaosTimer.play()
        }}
        onMouseLeave={() => {
          chaosTimer.play()
        }}
        onTouchStart={e => {
          chaosTimer.pause()
        }}
        onTouchEnd={e => {
          chaosTimer.play()
        }}
      />
    </div>
  )
}
