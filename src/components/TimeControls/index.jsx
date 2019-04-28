import React, { useEffect, useState } from "react"

export default function TimeControls(props) {
  const { tMin, tMax, timeKeeper } = props

  const [time, setTime] = useState(tMin)
  useEffect(() => {
    timeKeeper.on("set", setTime)

    return () => {
      timeKeeper.removeListener("set", setTime)
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
          timeKeeper.set(parseFloat(e.target.value))
          timeKeeper.skip()
        }}
        onMouseDown={() => timeKeeper.pause()}
        onMouseUp={() => timeKeeper.play()}
        onMouseLeave={() => timeKeeper.play()}
        onTouchStart={() => timeKeeper.pause()}
        onTouchEnd={() => timeKeeper.play()}
      />
    </div>
  )
}
