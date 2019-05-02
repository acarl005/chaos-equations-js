import React from "react"

export const negate = bool => !bool
export const space = <span>&nbsp;</span>
export const Link = props => <a {...props} rel="noopener noreferrer" target="_blank">{props.children}</a>

