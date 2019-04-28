import React from "react"
import * as THREE from "three"
import statsjs from "stats-js"
const stats = new statsjs()

import chaos from "./chaos"

export default class ChaosRenderer extends React.Component {
  // copied from https://github.com/mrdoob/three.js/blob/e4063750a93a643fce333a17a06b6b5015d9dc99/examples/js/WebGL.js#L8-L21
  static isWebGLAvailable() {
    try {
      const canvas = document.createElement("canvas")
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      )
    } catch {
      return false
    }
  }

  static getWheelColor(i) {
    return new THREE.Color(`hsl(${i % 360}, 100%, 50%)`)
  }

  componentDidMount() {
    if (!ChaosRenderer.isWebGLAvailable()) {
      return
    }
    // Renderer and canvas
    const { element, props } = this
    const renderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true, // allows for fancy fading trails
      antialias: true,
      powerPreference: "high-performance"
      //powerPreference: "low-power"
    })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(element.offsetWidth, element.offsetHeight)
    renderer.domElement.classList.add("chaos-canvas")
    // allows for fancy fading trails
    renderer.autoClearColor = false
    element.innerHTML = ""
    element.appendChild(renderer.domElement)
    this.renderer = renderer

    // Camera
    const aspectRatio = element.offsetWidth / element.offsetHeight
    const camera = new THREE.OrthographicCamera(
      -1 * aspectRatio, // left
      1 * aspectRatio, // right
      1, // top
      -1, // bottom
      // its 2-D, so this only needs to contain the plane with all the points
      0.9, // near
      1.1 // far
    )
    camera.position.set(0, 0, 1)
    this.aspectRatio = aspectRatio
    this.camera = camera

    // Scene and geometry
    const {
      chaosTimer,
      numIters,
      numSteps,
      colorSpread,
      colorOffset,
      pointSize,
      scaleFactor,
      trailPersistence,
      attenuation,
    } = props
    const scene = new THREE.Scene()
    this.scene = scene
    const numPoints = numIters * numSteps

    const positionsArray = []
    const colorsArray = []

    for (var i = 0; i < numPoints; i++) {
      positionsArray.push(0, 0, 0)

      // Depending on color mode, create color for point
      const { r, g, b } = ChaosRenderer.getWheelColor((i * colorSpread + colorOffset) % numIters)
      colorsArray.push(r, g, b)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(positionsArray, 3)
    )
    geometry.addAttribute(
      "color",
      new THREE.Float32BufferAttribute(colorsArray, 3)
    )
    this.geometry = geometry

    const pointsMaterial = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: THREE.VertexColors,
      transparent: true,
      opacity: 1 - attenuation
    })

    const points = new THREE.Points(geometry, pointsMaterial)
    points.scale.x = scaleFactor
    points.scale.y = -scaleFactor
    camera.lookAt(0, 0, 0)
    scene.add(points)
    this.points = points

    // Fading trails plane
    const tpVal = 1 - trailPersistence * trailPersistence
    const fadeColor = new THREE.Color(tpVal, tpVal, tpVal)
    const fadeGeometry = new THREE.PlaneGeometry(
      camera.right * 8,
      camera.top * 8
    )
    const fadeMaterial = new THREE.MeshBasicMaterial({
      color: fadeColor
    })
    fadeMaterial.blending = THREE.CustomBlending
    fadeMaterial.blendSrc = THREE.OneFactor
    fadeMaterial.blendDst = THREE.OneFactor
    fadeMaterial.blendEquation = THREE.ReverseSubtractEquation
    const fadePlane = new THREE.Mesh(fadeGeometry, fadeMaterial)
    scene.add(fadePlane)
    this.fadePlane = fadePlane

    // Kick off scene render loop
    // Normally this is bad but in this case I need it to be more performant
    // than being kept in React state.
    this.t = chaosTimer.get()
    chaosTimer.on("skip", this.renderFrame)
    this.applyChaos = chaos.bind(this)
    this.animate()

    // Event listeners
    window.addEventListener("resize", this.onWindowResize);
    [
      "MouseEnter",
      "MouseLeave",
      "MouseDown",
      "MouseMove",
      "MouseUp",
      "Wheel",
      "Click",
      "TouchStart",
      "TouchMove",
      "TouchEnd"
    ].forEach(ea => {
      if (typeof this.props[`on${ea}`] === "function") {
        renderer.domElement.addEventListener(ea.toLowerCase(), e => {
          e.preventDefault()
          this.props[`on${ea}`](e, camera, renderer.domElement)
        })
      }
    })

    // Stats
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
    const { props, geometry, points, fadePlane, stats } = this
    const { numIters, colorSpread, colorOffset } = props
    let shouldRenderFrame = false
    if (prevProps.scaleFactor !== props.scaleFactor) {
      shouldRenderFrame = true
    }
    if (prevProps.xPos !== props.xPos) {
      shouldRenderFrame = true
    }
    if (prevProps.yPos !== props.yPos) {
      shouldRenderFrame = true
    }
    if (prevProps.attenuation !== props.attenuation) {
      points.material.opacity = Math.min(
        Math.max(1 - props.attenuation, 0.01),
        0.99
      )
      shouldRenderFrame = true
    }
    if (prevProps.trailPersistence !== props.trailPersistence) {
      const tpVal = 1 - props.trailPersistence * props.trailPersistence
      fadePlane.material.color.setRGB(tpVal, tpVal, tpVal)
      shouldRenderFrame = true
    }
    if (prevProps.showStats !== props.showStats) {
      stats.dom.style.visibility = props.showStats ? "visible" : "hidden"
    }
    if (
      prevProps.colorOffset !== props.colorOffset ||
      prevProps.colorSpread !== props.colorSpread
    ) {
      const colorsArray = geometry.attributes.color.array
      for (let i = 0; i < colorsArray.length; i += 3) {
        const { r, g, b } = ChaosRenderer.getWheelColor((i * colorSpread + colorOffset) % numIters)
        colorsArray[i] = r
        colorsArray[i + 1] = g
        colorsArray[i + 2] = b
      }
      geometry.attributes.color.needsUpdate = true
      shouldRenderFrame = true
    }
    if (prevProps.pointSize !== props.pointSize) {
      points.material.size = props.pointSize
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
      props: { isPlaying = true, chaosTimer, showStats, tMin, tMax }
    } = this

    if (isPlaying && !chaosTimer.paused) {
      renderFrame()

      if (this.t > tMax) {
        this.t = tMin
        if (!this.props.repeat && !chaosTimer.paused) {
          this.props.onGenerateNewRandomParams()
        }
      } else if (this.t < tMin) {
        this.t = this.props.tMax
      }

      chaosTimer.set(this.t)
    }

    showStats && stats.end()

    requestAnimationFrame(animate)
  }

  renderFrame = () => {
    const { geometry, renderer, scene, camera, applyChaos } = this
    const { chaosTimer } = this.props
    this.t = chaosTimer.get()
    applyChaos()
    // required after the first render
    geometry.attributes.position.needsUpdate = true
    renderer.render(scene, camera)
  }

  render() {
    return (
      <div ref={el => this.element = el} className="chaos-container">
        <div className="chaos-item">
          Your browser does not support WebGL :'(
        </div>
      </div>
    )
  }
}
