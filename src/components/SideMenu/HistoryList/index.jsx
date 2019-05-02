import React from "react"

export function HistoryItem(props) {
  return (
    <div className="history-item">
      <span
        className={`history-item-inner ${props.active && "active"}`}
        onClick={props.onClick}
      >
        {props.children}
      </span>
    </div>
  )
}

export function HistoryList(props) {
  return (
    <div className="history-container">
      {props.children}
    </div>
  )
}
