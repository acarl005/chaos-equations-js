import React, { useEffect } from "react"

export default function TimeStrip(props) {
  const { tMin, tMax, chaosTimer } = props

  const [time, setTime] = React.useState(tMin)
  useEffect(() => {
    chaosTimer.on("set", setTime)

    return () => {
      chaosTimer.removeListener("set", setTime)
    }
  }, [])
  const formattedTime = time.toFixed(4)

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
        onMouseDown={() => chaosTimer.pause()}
        onMouseUp={() => chaosTimer.play()}
        onMouseLeave={() => chaosTimer.play()}
        onTouchStart={() => chaosTimer.pause()}
        onTouchEnd={() => chaosTimer.play()}
      />
    </div>
  )
}
