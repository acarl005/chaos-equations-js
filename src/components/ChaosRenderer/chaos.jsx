const DELTA_PER_STEP = 1e-5
const DELTA_MINIMUM = 1e-7

let history

/**
 * Calculates chaos equation iterations
 * Note the tight coupling to the ChaosRenderer context for performance reasons
 */
export default function chaos() {
  const { camera, geometry } = this
  let { rollingDelta = DELTA_PER_STEP, t } = this

  const {
    params,
    scaleFactor,
    timeFactor,
    xPos,
    yPos,
    numSteps,
    numIters,
  } = this.props

  history =
    history ||
    Array(numIters)
      .fill("")
      .map(() => ({ x: 0, y: 0 }))

  // Smooth out stepping speed
  const delta = DELTA_PER_STEP
  rollingDelta = rollingDelta * 0.99 + delta * 0.01

  // Apply chaos
  for (let step = 0; step < numSteps; step++) {
    let noPointsOnScreen = true
    let x = t
    let y = t

    for (let iter = 0; iter < numIters; iter++) {
      const { x: nx, y: ny } = params.evaluate(x, y, t)

      const screenXPos = (nx + xPos) * scaleFactor
      const screenYPos = (ny + yPos) * scaleFactor

      // Check if dynamic delta should be adjusted
      if (
        // only do this 1% of the time?
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
          Math.max(delta / (dist + 1e-5), DELTA_MINIMUM)
        )
        noPointsOnScreen = false
      }

      history[iter] = { x: nx, y: ny }

      // Update geometry
      geometry.attributes.position.array[
        (step * numIters + iter) * 3
      ] = screenXPos
      geometry.attributes.position.array[
        (step * numIters + iter) * 3 + 1
      ] = screenYPos
      x = nx
      y = ny
    }

    // Update t variable
    if (noPointsOnScreen) {
      t += 0.01 * timeFactor
    } else {
      t += rollingDelta * timeFactor
    }
  }

  this.t = t
  this.rollingDelta = rollingDelta
}
