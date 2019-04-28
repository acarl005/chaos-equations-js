import * as THREE from "three"

// copied from https://github.com/mrdoob/three.js/blob/e4063750a93a643fce333a17a06b6b5015d9dc99/examples/js/WebGL.js#L8-L21
export function isWebGLAvailable() {
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

export function fromColorWheel(i) {
  return new THREE.Color(`hsl(${i % 360}, 100%, 50%)`)
}

export function initThreeJS(
  element,
  numIters,
  numSteps,
  colorSpread,
  colorOffset,
  pointSize,
  scaleFactor,
  trailPersistence,
  attenuation,
) {

  // ----------------------
  // Renderer
  // ----------------------
  const renderer = new THREE.WebGLRenderer({
    preserveDrawingBuffer: true, // previous buffers needed for trailing effect
    antialias: true,
    powerPreference: "high-performance"
    //powerPreference: "low-power"
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(element.offsetWidth, element.offsetHeight)
  renderer.domElement.classList.add("chaos-canvas")
  // allow blending with previous layers for trailing effect
  renderer.autoClearColor = false
  element.innerHTML = ""
  element.appendChild(renderer.domElement)

  // ----------------------
  // Camera
  // ----------------------
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

  // ----------------------
  // Scene
  // ----------------------
  const scene = new THREE.Scene()

  // ----------------------
  // Geometry
  // ----------------------
  const numPoints = numIters * numSteps
  const positionsArray = []
  const colorsArray = []
  for (var i = 0; i < numPoints; i++) {
    positionsArray.push(0, 0, 0)
    // Depending on color mode, create color for point
    const { r, g, b } = fromColorWheel((i * colorSpread + colorOffset) % numIters)
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

  // ----------------------
  // Material
  // ----------------------
  const pointsMaterial = new THREE.PointsMaterial({
    size: pointSize,
    vertexColors: THREE.VertexColors,
    transparent: true,
    opacity: 1 - attenuation
  })

  // ----------------------
  // Points
  // ----------------------
  const points = new THREE.Points(geometry, pointsMaterial)
  points.scale.x = scaleFactor
  points.scale.y = -scaleFactor
  camera.lookAt(0, 0, 0)
  scene.add(points)

  // ----------------------
  // Fading trails plane
  // ----------------------
  const tpVal = 1 - trailPersistence ** 2
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
  return { renderer, camera, scene, geometry, points, fadePlane }
}

