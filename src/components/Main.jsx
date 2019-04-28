import React, { useState, useEffect } from "react"

import TimeKeeper from "../classes/TimeKeeper"
import ParametricFunction from "../classes/ParametricFunction"
import ChaosCanvas from "./ChaosCanvas"
import TimeControls from "./TimeControls"
import EquationView from "./EquationView"
import Icon from "./Icon"
import InfoModal from "./InfoModal"
import ParamModal from "./ParamModal"
import ControlMessage from "./ControlMessage"
import SideMenu from "./SideMenu"

import { negate } from "../utils"

// Initial equation parameters from url
const searchParams = new URL(window.location.href).searchParams
const initialShowControls = searchParams.get("controls") !== "false"
const initialParamCode = (searchParams.get("p") || "")
  .substr(0, 6)
  .toUpperCase()
  .replace(/[^A-Z_]/g, "")

const tMin = -3
const tMax = 3
const numIters = 800
const numSteps = 500
const timeKeeper = new TimeKeeper(tMin)

export default function Main() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [params, setParams] = useState(
    () =>
      (initialParamCode && ParametricFunction.fromCode(initialParamCode)) ||
      ParametricFunction.random()
  )
  const [paramsString, setParamsString] = useState(() =>
    params.toCode()
  )
  const [xPos, setXPos] = useState(0)
  const [yPos, setYPos] = useState(0)
  const [dragStartXPos, setDragStartXPos] = useState(0)
  const [dragStartYPos, setDragStartYPos] = useState(0)
  const [dragStartMouseX, setDragStartMouseX] = useState(0)
  const [dragStartMouseY, setDragStartMouseY] = useState(0)
  const [touchStartScaleFactor, setTouchStartScaleFactor] = useState(1)
  const [touchStartDistance, setTouchStartDistance] = useState(0)
  const [scaleFactor, setScaleFactor] = useState(1)
  const [timeFactor, setTimeFactor] = useState(0.5)
  const [draggingCanvas, setDraggingCanvas] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [attenuation, setAttenuation] = useState(0.85)
  const [trailPersistence, setTrailPersistence] = useState(0.6)
  const [history, setHistory] = useState(
    localStorage.getItem("chaos-equations-history") || ""
  )
  const [withinClickRadius, setWithinClickRadius] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [colorSpread, setColorSpread] = useState(4)
  const [colorOffset, setColorOffset] = useState(0)
  const [modalOpen, setModalOpen] = useState("none")
  const [pausedFromModal, setPausedFromModal] = useState(false)
  const [showTransformStats, setShowTransformStats] = useState(false)
  const [mousePos, setMousePos] = useState(() => ({ x: 0, y: 0 }))
  const [pointSize, setPointSize] = useState(1)
  const [showControls, setShowControls] = useState(initialShowControls)

  function reset() {
    timeKeeper.set(tMin)
    timeKeeper.play()
    setIsPlaying(true)
    setScaleFactor(1)
    setXPos(0)
    setYPos(0)
  }

  useEffect(() => {
    // Browser history state changes
    window.addEventListener("popstate", e => {
      setParamsString(e.state)
      setParams(ParametricFunction.fromCode(e.state))
      reset()
    })
    // Mouse movement
    window.addEventListener("mousemove", e => {
      setShowTransformStats(showTransformStats => {
        if (showTransformStats) {
          setMousePos({ x: e.clientX, y: e.clientY })
        }
        return showTransformStats
      })
    })
  }, [])

  useEffect(() => {
    // On initial render and every time paramsString is updated, log it to history
    if (history.indexOf(paramsString) < 0) {
      const newHistoryItem = `${history.length > 0 ? "," : ""}${paramsString}`
      const newHistory = history + newHistoryItem
      localStorage.setItem("chaos-equations-history", newHistory)
      setHistory(newHistory)
    }
    if (paramsString && paramsString !== window.history.state) {
      window.history.pushState(
        paramsString,
        paramsString,
        `?p=${paramsString}`
      )
    }
  }, [paramsString])

  return (
    <div className="container" onContextMenu={e => e.preventDefault()} >
      {modalOpen === "info" && <InfoModal {...{ setPausedFromModal, setIsPlaying, setModalOpen }} />}
      {modalOpen === "param" && (
        <ParamModal
          {...{ paramsString, setPausedFromModal, setIsPlaying, setModalOpen }}
          onSave={newValue => {
            setParamsString(newValue)
            setParams(ParametricFunction.fromCode(newValue))
            setModalOpen("none")
            if (paramsString !== newValue) {
              reset()
            }
          }}
        />
      )}
      <div className="top-left-container" style={{ display: showControls ? "flex" : "none", }} >
        <div className="top-right-container">
          <Icon
            onClick={() => {
              setModalOpen("info")
              setIsPlaying(false)
              if (isPlaying) {
                setPausedFromModal(true)
              }
            }}
          >
            <span className="icon-question" />
          </Icon>
        </div>
        {showTransformStats && (
          <div className="bottom-left-container" >
            <div>{`mouse (${mousePos.x}, ${mousePos.y})`}</div>
            <div>{`position (${xPos.toFixed(3)}, ${yPos.toFixed(3)})`}</div>
            <div>{`scale (${scaleFactor.toFixed(3)})`}</div>
          </div>
        )}
        <div className="edit-params-container">
          Code: {paramsString}
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
        <EquationView {...{ params }} />
        <SideMenu
          historySelect={histCode => {
            if (paramsString !== histCode) {
              timeKeeper.set(tMin)
            }
            setParamsString(histCode)
            setParams(ParametricFunction.fromCode(histCode))
            setIsPlaying(true)
          }}
          {...{
            history,
            paramsString,
            repeat, setRepeat,
            timeFactor, setTimeFactor,
            pointSize, setPointSize,
            attenuation, setAttenuation,
            trailPersistence, setTrailPersistence,
            colorSpread, setColorSpread,
            colorOffset, setColorOffset,
            showStats, setShowStats,
            showTransformStats, setShowTransformStats,
            showControls, setShowControls
          }}
        />
      </div>
      {
        !showControls ? (
          <div className="bottom-container">
            <ControlMessage setShowControls={setShowControls} showControls={showControls} />
          </div>
        ) : ""
      }
      <div className="bottom-container" style={{ display: showControls ? "flex" : "none" }}>
        <div className="time-button-container">
          <Icon
            style={{ margin: "0 0.5rem" }}
            onClick={() => setIsPlaying(negate)}
          >
            {isPlaying ? (
              <span className="icon-pause2" />
            ) : (
              <span className="icon-play3" />
            )}
          </Icon>
          <Icon
            style={{ margin: "0 0.5rem" }}
            onClick={() => {
              const newParams = ParametricFunction.random()
              setParams(newParams)
              setParamsString(newParams.toCode())
              reset()
            }}
          >
            <span className="icon-next2" />
          </Icon>
        </div>
        <TimeControls {...{ tMin, tMax, timeKeeper }} />
      </div>
      <ChaosCanvas
        {...{
          timeKeeper,
          params,
          isPlaying,
          tMin,
          tMax,
          xPos,
          yPos,
          scaleFactor,
          timeFactor,
          repeat,
          attenuation,
          showStats,
          colorSpread,
          numIters,
          numSteps,
          pointSize,
          colorOffset: colorOffset * numIters,
          trailPersistence: 1 - 2 ** (-trailPersistence * 10),
          onGenerateNewRandomParams: () => {
            const newParams = ParametricFunction.random()
            setParams(newParams)
            setParamsString(newParams.toCode())
            setScaleFactor(1)
            setXPos(0)
            setYPos(0)
          },
          onWheel: (e, camera) => {
            const dy = Math.min(Math.max(e.deltaY / -1000, -0.5), 0.5)
            setScaleFactor(oldScaleFactor => {
              return oldScaleFactor * (1 + dy)
            })
          },
          onMouseDown: e => {
            setDraggingCanvas(true)
            setDragStartMouseX(e.clientX)
            setDragStartMouseY(e.clientY)
            setDragStartXPos(xPos)
            setDragStartYPos(yPos)
            setWithinClickRadius(true)
            if ("activeElement" in document) {
              document.activeElement.blur()
            }
          },
          onMouseMove: (e, camera, canvas) => {
            if (draggingCanvas) {
              const xRatio =
                ((camera.left / canvas.offsetWidth) * 2) / scaleFactor
              const yRatio =
                ((camera.bottom / canvas.offsetHeight) * 2) / scaleFactor
              const xDiff = xRatio * (dragStartMouseX - e.clientX)
              const yDiff = yRatio * (dragStartMouseY - e.clientY)
              setXPos(dragStartXPos + xDiff)
              setYPos(dragStartYPos + yDiff)
            }
            const dist = Math.sqrt(
              Math.pow(dragStartMouseX - e.clientX, 2) +
                Math.pow(dragStartMouseY - e.clientY, 2)
            )
            if (dist > 4) {
              setWithinClickRadius(false)
            }
          },
          onMouseUp: () => {
            setDraggingCanvas(false)
          },
          onMouseLeave: () => {
            setDraggingCanvas(false)
          },
          onClick: () => {
            // On click, play/pause if mouse hasn't moved much
            if (withinClickRadius) {
              setIsPlaying(negate)
            }
          },
          onTouchStart: e => {
            setDraggingCanvas(true)
            if (e.touches.length === 1) {
              setDragStartMouseX(e.touches[0].clientX)
              setDragStartMouseY(e.touches[0].clientY)
              setDragStartXPos(xPos)
              setDragStartYPos(yPos)
              setWithinClickRadius(true)
            }
            if (e.touches.length === 2) {
              setTouchStartDistance(
                Math.sqrt(
                  Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
                    Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
                )
              )
              setTouchStartScaleFactor(scaleFactor)
              setWithinClickRadius(false)
            }
          },
          onTouchMove: (e, camera, canvas) => {
            if (draggingCanvas) {
              const xRatio =
                ((camera.left / canvas.offsetWidth) * 2) / scaleFactor
              const yRatio =
                ((camera.bottom / canvas.offsetHeight) * 2) / scaleFactor
              const xDiff = xRatio * (dragStartMouseX - e.touches[0].clientX)
              const yDiff = yRatio * (dragStartMouseY - e.touches[0].clientY)
              setXPos(dragStartXPos + xDiff)
              setYPos(dragStartYPos + yDiff)
            }
            if (e.touches.length === 2) {
              const newDist = Math.sqrt(
                Math.pow(e.touches[0].clientX - e.touches[1].clientX, 2) +
                  Math.pow(e.touches[0].clientY - e.touches[1].clientY, 2)
              )
              const scaleRatio = newDist / touchStartDistance
              setScaleFactor(() => {
                return touchStartScaleFactor * scaleRatio
              })
            }
            const dist = Math.sqrt(
              Math.pow(dragStartMouseX - e.touches[0].clientX, 2) +
                Math.pow(dragStartMouseY - e.touches[0].clientY, 2)
            )
            if (dist > 4) {
              setWithinClickRadius(false)
            }
          },
          onTouchEnd: () => {
            // On tap, play/pause if mouse hasn't moved much
            if (draggingCanvas && withinClickRadius) {
              setIsPlaying(negate)
            }
            setDraggingCanvas(false)
          }
        }}
      />
    </div>
  )
}
