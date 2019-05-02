import React from "react"
import statsjs from "stats-js"
const stats = new statsjs()

import { Link, space as sp } from "../../utils"
import chaos from "./chaos"
import * as graphics from "./graphics"

export default class ChaosCanvas extends React.Component {

  componentDidMount() {
    if (!graphics.isWebGLAvailable()) {
      return
    }
    const { element, props } = this
    const {
      timeKeeper, numIters, numSteps,
      colorSpread, colorOffset, pointSize,
      scaleFactor, trailPersistence, attenuation
    } = props
    const {
      renderer, camera, scene,
      geometry, points, fadePlane
    } = graphics.initThreeJS(
      element, numIters, numSteps,
      colorSpread, colorOffset, pointSize,
      scaleFactor, trailPersistence, attenuation
    )
    this.renderer  = renderer
    this.camera    = camera
    this.scene     = scene
    this.geometry  = geometry
    this.points    = points
    this.fadePlane = fadePlane

    // initiate the render loop. time is kept out of the React state for performance,
    // even though its more confusing
    this.t = timeKeeper.get()
    timeKeeper.on("skip", this.renderFrame)
    this.applyChaos = chaos.bind(this)
    this.animate()

    // register the event listeners on the <canvas> tag
    window.addEventListener("resize", this.onWindowResize)
    const events = [
      "MouseEnter", "MouseLeave", "MouseDown",
      "MouseMove", "MouseUp", "Wheel", "Click",
      "TouchStart", "TouchMove", "TouchEnd"
    ]
    for (let evnt of events) {
      if (typeof this.props[`on${evnt}`] === "function") {
        renderer.domElement.addEventListener(evnt.toLowerCase(), e => {
          e.preventDefault()
          this.props[`on${evnt}`](e, camera, renderer.domElement)
        })
      }
    }

    // FPS Stats window
    stats.showPanel(0)
    stats.dom.style.right = 0
    stats.dom.style.bottom = "2rem"
    stats.dom.style.left = ""
    stats.dom.style.top = ""
    stats.dom.style.visibility = this.props.showStats ? "visible" : "hidden"
    document.body.appendChild(stats.dom)
    this.stats = stats
  }

  componentDidUpdate(prevProps, prevState) {
    // check which things need updating and handle accordingly
    const { props, geometry, points, fadePlane, stats } = this
    const {
      numIters, colorSpread, colorOffset, xPos, yPos,
      scaleFactor, attenuation, trailPersistence,
      pointSize, showStats
    } = props
    let shouldRenderFrame = false
    if (prevProps.scaleFactor !== scaleFactor) {
      shouldRenderFrame = true
    }
    if (prevProps.xPos !== xPos) {
      shouldRenderFrame = true
    }
    if (prevProps.yPos !== yPos) {
      shouldRenderFrame = true
    }
    if (prevProps.attenuation !== attenuation) {
      points.material.opacity = Math.min(
        Math.max(1 - attenuation, 0.01),
        0.99
      )
      shouldRenderFrame = true
    }
    if (prevProps.trailPersistence !== trailPersistence) {
      const tpVal = 1 - trailPersistence * trailPersistence
      fadePlane.material.color.setRGB(tpVal, tpVal, tpVal)
      shouldRenderFrame = true
    }
    if (prevProps.showStats !== showStats) {
      stats.dom.style.visibility = showStats ? "visible" : "hidden"
    }
    if (
      prevProps.colorOffset !== colorOffset ||
      prevProps.colorSpread !== colorSpread
    ) {
      const colorsArray = geometry.attributes.color.array
      for (let i = 0; i < colorsArray.length; i += 3) {
        const { r, g, b } = graphics.fromColorWheel((i * colorSpread + colorOffset) % numIters)
        colorsArray[i] = r
        colorsArray[i + 1] = g
        colorsArray[i + 2] = b
      }
      geometry.attributes.color.needsUpdate = true
      shouldRenderFrame = true
    }
    if (prevProps.pointSize !== pointSize) {
      points.material.size = pointSize
      shouldRenderFrame = true
    }
    shouldRenderFrame && this.renderFrame()
  }

  onWindowResize = () => {
    const { camera, renderer, element } = this
    const aspectRatio = element.offsetWidth / element.offsetHeight
    camera.left = -1 * aspectRatio
    camera.right = 1 * aspectRatio
    camera.bottom = -1
    camera.top = 1
    camera.updateProjectionMatrix()
    renderer.setSize(element.offsetWidth, element.offsetHeight)
    this.aspectRatio = aspectRatio
  }

  animate = () => {
    showStats && stats.begin()

    const {
      animate,
      renderFrame,
      props: { isPlaying, timeKeeper, showStats, tMin, tMax }
    } = this

    if (isPlaying && !timeKeeper.paused) {
      renderFrame()

      if (this.t > tMax) {
        this.t = tMin
        if (!this.props.repeat) {
          this.props.onGenerateNewRandomParams()
        }
      } else if (this.t < tMin) {
        this.t = this.props.tMax
      }

      timeKeeper.set(this.t)
    }

    showStats && stats.end()

    requestAnimationFrame(animate)
  }

  renderFrame = () => {
    const { geometry, renderer, scene, camera, applyChaos } = this
    const { timeKeeper } = this.props
    this.t = timeKeeper.get()
    applyChaos()
    geometry.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
  }

  render() {
    return (
      <div ref={el => this.element = el} className="chaos-container">
        <div className="chaos-item">
          A browser with WebGL is required, such as {sp}
          <Link href="https://www.google.com/chrome/">Google Chrome</Link>
        </div>
      </div>
    )
  }
}
