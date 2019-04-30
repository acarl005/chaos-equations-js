const deltaPerStep = 1e-5
const deltaMinimum = 1e-7

let history

/**
 * Calculates chaos equation iterations for one frame
 * Note the tight coupling to the ChaosCanvas context for performance reasons
 */
export default function chaos() {
  const { camera, geometry } = this
  let { rollingDelta = deltaPerStep, t } = this

  const {
    params,
    scaleFactor,
    timeFactor,
    xPos,
    yPos,
    numSteps,
    numIters,
  } = this.props

  history = history || Array(numIters)
    .fill(null)
    .map(() => ({ x: 0, y: 0 }))

  // smooth out stepping speed
  const delta = deltaPerStep
  rollingDelta = rollingDelta * 0.99 + delta * 0.01

  // apply chaos, run 500 (numSteps) time steps for all points
  for (let step = 0; step < numSteps; step++) {
    let noPointsOnScreen = true
    let x = t
    let y = t

    // calculate the positions of the 800 (numIters) points recursively
    for (let iter = 0; iter < numIters; iter++) {
      const { x: nx, y: ny } = params.evaluate(x, y, t)

      const screenXPos = (nx + xPos) * scaleFactor
      const screenYPos = (ny + yPos) * scaleFactor

      // check if dynamic delta should be adjusted
      if (
        // only do once per 100 iters
        iter % 100 === 0 &&
        screenXPos > camera.left &&
        screenYPos > camera.bottom &&
        screenXPos < camera.right &&
        screenYPos < camera.top
      ) {
        const dx = history[iter] ? history[iter].x - nx : nx
        const dy = history[iter] ? history[iter].y - ny : ny
        const dist = 500 * Math.sqrt(dx * dx + dy * dy)
        rollingDelta = Math.min(
          rollingDelta,
          Math.max(delta / (dist + 1e-5), deltaMinimum)
        )
        noPointsOnScreen = false
      }

      history[iter].x = nx
      history[iter].y = ny

      // update THREE.js geometry directly (for performance reasons)
      const pointInd = (step * numIters + iter) * 3
      geometry.attributes.position.array[pointInd] = screenXPos
      geometry.attributes.position.array[pointInd + 1] = screenYPos
      x = nx
      y = ny
    }

    // update t variable
    if (noPointsOnScreen) {
      // go very fast if nothing is on screen
      t += 0.01 * timeFactor
    } else {
      t += rollingDelta * timeFactor
    }
  }

  this.t = t
  this.rollingDelta = rollingDelta
}
