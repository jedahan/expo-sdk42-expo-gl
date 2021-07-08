import { GLView } from 'expo-gl'
import { Renderer, TextureLoader } from 'expo-three'
import OrbitControlsView from 'expo-three-orbit-controls'
import React, { useRef } from 'react'
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from 'three'

import { getEarthFromAfar } from './getEarthFromAfar.js'

export default function App() {
  let timeout

  const orbitControlsRef = useRef(null)

  const [camera, setCamera] = React.useState(null)

  React.useEffect(() => {
    // Clear the animation loop when the component unmounts
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
          const sceneColor = 0x333333

          // Create a WebGLRenderer without a DOM element
          const renderer = new Renderer({ gl })
          renderer.setSize(width, height)
          renderer.setClearColor(sceneColor)

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000)
          camera.position.set(2, 5, 5)
          setCamera(camera)

          const scene = new Scene()
          scene.fog = new Fog(sceneColor, 1, 10000)
          scene.add(new GridHelper(10, 10))

          const ambientLight = new AmbientLight(0x101010)
          scene.add(ambientLight)

          const pointLight = new PointLight(0xffffff, 2, 1000, 1)
          pointLight.position.set(0, 200, 200)
          scene.add(pointLight)

          const earthFromAfar = getEarthFromAfar()
          scene.add(earthFromAfar)
          // const geometry = new THREE.SphereGeometry(2, 128, 128)

          // const materials = new THREE.MeshPhongMaterial({
          //   color: new THREE.Color(0xcad2df),
          //   map: new TextureLoader().load(
          //     // eslint-disable-next-line @typescript-eslint/no-var-requires
          //     require('./assets/globe-light-landmass-invert.png')
          //   ),
          //   shininess: 0.9,
          //   flatShading: false,
          //   side: THREE.FrontSide,
          // })

          // const earth = new THREE.Mesh(geometry, materials)
          // scene.add(earth)

          // const earth2 = new Earth()
          // scene.add(earth2)

          const spotLight = new SpotLight(0xff00ff, 1)
          camera.add(spotLight)

          const cube = new IconMesh()
          scene.add(cube)

          camera.lookAt(cube.position)

          function update() {
            cube.rotation.y += 0.05
            cube.rotation.x += 0.025
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

class IconMesh extends Mesh {
  constructor() {
    super(
      new BoxBufferGeometry(1.0, 1.0, 1.0),
      new MeshStandardMaterial({
        map: new TextureLoader().load(require('./assets/icon.png')),
        // color: 0x660000,
      })
    )
  }
}

// class Earth extends Mesh {
//   constructor() {
//     super(
//       new THREE.SphereGeometry(2, 128, 128),
//       new THREE.MeshPhongMaterial({
//         color: new THREE.Color(0xcadfdf),
//         map: new TextureLoader().load(
//           // eslint-disable-next-line @typescript-eslint/no-var-requires
//           require('./assets/globe-light-landmass-invert.png')
//         ),
//       })
//     )
//   }
// }
