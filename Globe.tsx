import { GLView } from 'expo-gl'
import { Renderer, TextureLoader } from 'expo-three'
import OrbitControlsView from 'expo-three-orbit-controls'
import React, { useRef } from 'react'
import {
  AmbientLight,
  Fog,
  GridHelper,
  Mesh,
  MeshPhongMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
} from 'three'

export function Globe() {
  let timeout: number

  const orbitControlsRef = useRef<typeof OrbitControlsView | undefined>(null)

  const [camera, setCamera] = React.useState<PerspectiveCamera | null>()

  // Clear the animation loop when the component unmounts
  React.useEffect(() => {
    return () => clearTimeout(timeout)
  }, [])

  let hasSetup = false

  return (
    <OrbitControlsView style={{ flex: 1 }} camera={camera} ref={orbitControlsRef}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
          // const sceneColor = 0x6ad6f0
          const sceneColor = 0x330033

          // Create a WebGLRenderer without a DOM element
          const renderer = new Renderer({ gl })
          renderer.setSize(width, height)
          renderer.setClearColor(sceneColor)

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000)
          setCamera(camera)

          const scene = new Scene()
          scene.fog = new Fog(sceneColor, 1, 10000)
          scene.add(new GridHelper(10, 10))

          const ambientLight = new AmbientLight(0x101010)
          scene.add(ambientLight)

          const pointLight = new PointLight(0xffffff, 2, 1000, 1)
          pointLight.position.set(0, 200, 200)
          scene.add(pointLight)

          const earth = new Earth()
          scene.add(earth)

          const spotLight = new SpotLight(0xff00ff, 1)
          camera.add(spotLight)

          function update() {
            orbitControlsRef?.current?.getControls()?.update()
          }

          function setupOrbitControls() {
            const controls = orbitControlsRef?.current?.getControls()
            if (!hasSetup && controls) {
              controls.autoRotate = true
              controls.autoRotateSpeed = 1.1
              controls.minPolarAngle = Math.PI * 0.2
              controls.maxPolarAngle = Math.PI * 0.6
              controls.enableDamping = true
              controls.autoRotate = true
              controls.enablePan = false
              controls.maxDistance = 10
              controls.minDistance = 10
              controls.dampingFactor = 0.04
              controls.rotateSpeed = 2
              hasSetup = true
            }
          }

          // Setup an animation loop
          const render = () => {
            timeout = requestAnimationFrame(render)
            update()
            setupOrbitControls()
            renderer.render(scene, camera)
            gl.endFrameEXP()
          }
          render()
        }}
      />
    </OrbitControlsView>
  )
}

class Earth extends Mesh {
  constructor() {
    super(
      new SphereGeometry(2, 128, 128),
      new MeshPhongMaterial({
        map: new TextureLoader().load(require('./assets/globe-light-landmass-invert.png')),
      })
    )
  }
}
