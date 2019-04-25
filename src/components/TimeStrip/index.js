import React from "react"

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
    <div
      onMouseDown={e => {
        e.preventDefault()
        setNewT(e)
        chaosTimer.pause()
      }}
      onMouseMove={e => {
        e.preventDefault()
        if (chaosTimer.paused) {
          setNewT(e)
        }
      }}
      onMouseUp={e => {
        e.preventDefault()
        // setNewT(e)
        chaosTimer.play()
      }}
      onTouchStart={e => {
        // e.preventDefault()
        setNewT(e.touches[0])
        chaosTimer.pause()
      }}
      onTouchMove={e => {
        // e.preventDefault()
        if (chaosTimer.paused) {
          setNewT(e.touches[0])
        }
      }}
      onTouchEnd={e => {
        // e.preventDefault()
        // setNewT(e.touches[0])
        chaosTimer.play()
      }}
      onMouseLeave={() => {
        chaosTimer.play()
      }}
      style={{
        width: "100%",
        height: 32,
        background: "rgba(0, 144, 255, 0.25)",
        cursor: "ew-resize",
      }}
    >
      <div
        style={{
          background: "rgba(0, 144, 255, 0.5)",
          width: `${currentRatio * 100}%`,
          height: "100%",
          position: "relative",
          borderRight: "2px solid rgb(0, 144, 255)",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: `translate(${currentRatio <= 0.5 ? 100 : 0}%, -50%)`,
            transition: "transform 0.3s ease-out",
            padding: "0 16px",
            userSelect: "none",
          }}
        >
          t = {formattedTime}
        </div>
      </div>
    </div>
  )
}
