import React, { useState, useEffect } from "react"

import ChaosTimer from "../classes/ChaosTimer"
import ParametricFunction from "../classes/ParametricFunction"
import ChaosRenderer from "./ChaosRenderer"
import EditableParamValue from "./EditableParamValue"
import TimeStrip from "./TimeStrip"
import ParamEquation from "./ParamEquation"
import Button from "./Button"
import { HistoryList, HistoryItem } from "./HistoryList"
import Slider from "./Slider"
import ConfigSection from "./ConfigSection"
import Icon from "./Icon"
import Checkbox from "./Checkbox"
import InfoModal from "./InfoModal"

// Initial equation parameters from url
const urlParams = new URL(window.location.href).searchParams
const controls = urlParams.get("controls") !== "false"
let initialParamCode = urlParams.get("p") || ""
initialParamCode = initialParamCode
  .substr(0, 6)
  .toUpperCase()
  .replace(/[^A-Z_]/g, "")

const tMin = -3
const tMax = 3
const numIters = 800
const numSteps = 500
const chaosTimer = new ChaosTimer(tMin)

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
  const [openPanel, setOpenPanel] = useState("")
  const [history, setHistory] = useState(
    localStorage.getItem("chaos-equations-history") || ""
  )
  const [withinClickRadius, setWithinClickRadius] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [colorSpread, setColorSpread] = useState(4)
  const [colorOffset, setColorOffset] = useState(0)
  const [infoOpen, setInfoOpen] = useState(false)
  const [pausedFromInfo, setPausedFromInfo] = useState(false)
  const [showTransformStats, setShowTransformStats] = useState(false)
  const [mousePos, setMousePos] = useState(() => ({ x: 0, y: 0 }))
  const [pointSize, setPointSize] = useState(1)

  function reset() {
    chaosTimer.set(tMin)
    chaosTimer.play()
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
        `?p=${paramsString}&controls=${controls}`
      )
    }
  }, [paramsString])

  return (
    <div className="container" onContextMenu={e => e.preventDefault()} >
      {infoOpen && <InfoModal {...{ setPausedFromInfo, setIsPlaying, setInfoOpen }} />}
      <div className="top-left-container" style={{ display: controls ? "flex" : "none", }} >
        <div className="top-right-container">
          <Icon
            onClick={() => {
              setInfoOpen(true)
              setIsPlaying(false)
              if (isPlaying) {
                setPausedFromInfo(true)
              }
            }}
          >
            <span className="icon-question" />
          </Icon>
        </div>
        {showTransformStats && (
          <div className="bottom-left-container" >
            <div>{`mouse x(${mousePos.x}) y(${mousePos.y})`}</div>
            <div>{`position x(${xPos.toFixed(3)}) y(${yPos.toFixed(3)})`}</div>
            <div>{`scale (${scaleFactor.toFixed(3)})`}</div>
          </div>
        )}
        <div style={{ display: "flex" }}>
          <EditableParamValue
            value={paramsString}
            exclusive
            onSave={newValue => {
              setParamsString(newValue)
              setParams(ParametricFunction.fromCode(newValue))
              if (paramsString !== newValue) {
                reset()
              }
            }}
          />
        </div>
        <ParamEquation {...{ params }} />
        <div>
          <div style={{ display: "flex" }}>
            <Button
              active={openPanel === "config"}
              style={{ marginLeft: "0.5rem" }}
              onClick={() => {
                setOpenPanel(openPanel =>
                  openPanel !== "config" ? "config" : ""
                )
              }}
            >
              Settings
            </Button>
            <Button
              active={openPanel === "history"}
              style={{ marginLeft: "0.5rem" }}
              onClick={() => {
                setOpenPanel(openPanel =>
                  openPanel !== "history" ? "history" : ""
                )
              }}
            >
              History
            </Button>
          </div>
        </div>
        <div className="settings-container" >
          {openPanel === "config" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ConfigSection>
                <Checkbox
                  value={repeat}
                  onChange={() => setRepeat(repeat => !repeat)}
                >
                  Repeat Current Params
                </Checkbox>
              </ConfigSection>
              <ConfigSection>
                <label>Speed</label>
                <Slider
                  min="-2"
                  max="2"
                  step="0.01"
                  value={timeFactor}
                  onChange={e => setTimeFactor(parseFloat(e.target.value))}
                >
                  {timeFactor}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <label>Point Size</label>
                <Slider
                  min="0.5"
                  max="4"
                  step="0.5"
                  value={pointSize}
                  onChange={e => setPointSize(parseFloat(e.target.value))}
                >
                  {pointSize}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <label>Point Attenuation</label>
                <Slider
                  min="0.5"
                  max="0.99"
                  step="0.01"
                  value={attenuation}
                  onChange={e => setAttenuation(parseFloat(e.target.value))}
                >
                  {attenuation}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <label>Trail Persistence</label>
                <Slider
                  min="0"
                  max="1"
                  step="0.1"
                  value={trailPersistence}
                  onChange={e => setTrailPersistence(parseFloat(e.target.value))}
                >
                  {trailPersistence}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <label>Color Spread</label>
                <Slider
                  min="0"
                  max="10"
                  step="1"
                  value={colorSpread}
                  onChange={e => setColorSpread(parseFloat(e.target.value))}
                >
                  {colorSpread}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <label>Color Offset</label>
                <Slider
                  min="0"
                  max="1"
                  step=".01"
                  value={colorOffset}
                  onChange={e => setColorOffset(parseFloat(e.target.value))}
                >
                  {colorOffset}
                </Slider>
              </ConfigSection>
              <ConfigSection>
                <Checkbox
                  value={showStats}
                  onChange={() => setShowStats(showStats => !showStats)}
                >
                  Show FPS
                </Checkbox>
              </ConfigSection>
              <ConfigSection>
                <Checkbox
                  value={showTransformStats}
                  onChange={() => setShowTransformStats(showTransformStats => !showTransformStats)}
                >
                  Show Transform
                </Checkbox>
              </ConfigSection>
            </div>
          )}
          {openPanel === "history" && (
            <HistoryList>
              {history
                .split(",")
                .reverse()
                .map((ea, i) => {
                  return (
                    <HistoryItem
                      active={ea === paramsString}
                      key={`${ea}-${i}`}
                      onClick={() => {
                        if (paramsString !== ea) {
                          chaosTimer.set(tMin)
                        }
                        setParamsString(ea)
                        setParams(ParametricFunction.fromCode(ea))
                        setIsPlaying(true)
                      }}
                    >
                      {ea}
                    </HistoryItem>
                  )
                })}
            </HistoryList>
          )}
        </div>
      </div>
      <div className="button-container" style={{ display: controls ? "flex" : "none" }}>
        <div style={{ marginBottom: "1rem" }}>
          <Icon
            style={{ margin: "0 0.5rem" }}
            onClick={() => setIsPlaying(isPlaying => !isPlaying)}
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
            <span className={`icon-shuffle`} />
          </Icon>
        </div>
        <TimeStrip {...{ tMin, tMax, chaosTimer }} />
      </div>
      <ChaosRenderer
        {...{
          chaosTimer,
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
              setIsPlaying(isPlaying => !isPlaying)
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
              setIsPlaying(isPlaying => !isPlaying)
            }
            setDraggingCanvas(false)
          }
        }}
      />
    </div>
  )
}