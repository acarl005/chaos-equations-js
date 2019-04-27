import React, { useState } from "react"

import Checkbox from "./Checkbox"
import Slider from "./Slider"
import { HistoryList, HistoryItem } from "./HistoryList"

import { negate } from "../../utils"

export default function SideMenu(props) {
  const [openPanel, setOpenPanel] = useState("")
  const {
    history,
    paramsString,
    historySelect,
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
  } = props
  return <>
    <div className="nav-container">
      <button
        className={`settings-button ${openPanel == "config" ? "active" : ""}`}
        onClick={() => {
          setOpenPanel(openPanel =>
            openPanel !== "config" ? "config" : "none"
          )
        }}
      >
        Settings
      </button>
      <button
        className={`settings-button ${openPanel == "history" ? "active" : ""}`}
        onClick={() => {
          setOpenPanel(openPanel =>
            openPanel !== "history" ? "history" : "none"
          )
        }}
      >
        History
      </button>
    </div>
    <div className="settings-container" >
      {openPanel === "config" && (
        <div className="config-container">
          <div className="config-item">
            <Checkbox
              value={repeat}
              onChange={() => setRepeat(negate)}
              id="rep-cur-params"
            >
              Repeat Current Params
            </Checkbox>
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
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
          </div>
          <div className="config-item">
            <Checkbox
              value={showStats}
              onChange={() => setShowStats(negate)}
              id="show-fps"
            >
              Show FPS
            </Checkbox>
          </div>
          <div className="config-item">
            <Checkbox
              value={showTransformStats}
              onChange={() => setShowTransformStats(negate)}
              id="show-xform"
            >
              Show Transform
            </Checkbox>
          </div>
          <div className="config-item">
            <Checkbox
              value={showControls}
              onChange={() => setShowControls(negate)}
              id="show-controls"
            >
              Show Controls
            </Checkbox>
          </div>
        </div>
      )}
      {openPanel === "history" && (
        <HistoryList>
          {
            history
              .split(",")
              .reverse()
              .map((histCode, i) =>
                  <HistoryItem
                    active={histCode === paramsString}
                    key={`${histCode}-${i}`}
                    onClick={() => historySelect(histCode)}
                  >
                    {histCode}
                  </HistoryItem>
              )
          }
        </HistoryList>
      )}
    </div>
  </>
}
