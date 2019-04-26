import React from "react"
import Slider from '../Slider'

export default function TimeStrip(props) {
  const { tMin, tMax, chaosTimer } = props

  const [time, setTime] = React.useState(0)
  React.useEffect(() => {
    const handleSetTime = t => {
      setTime(t)
    }

    chaosTimer.on("set", handleSetTime)

    return function cleanUp() {
      chaosTimer.removeListener("set", handleSetTime)
    }
  }, [])
  const formattedTime = time.toFixed(4)
  const currentRatio = Math.abs(time - tMin) / (tMax - tMin)

  const setNewT = e => {
    const barWidth = e.target.offsetWidth
    const clickPos = e.clientX
    const newT = (clickPos / barWidth) * (tMax - tMin) + tMin
    chaosTimer.set(newT)
    chaosTimer.skip()
  }

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
