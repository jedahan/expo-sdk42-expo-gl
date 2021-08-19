import { GLView } from 'expo-gl'
import { Renderer, TextureLoader } from 'expo-three'
import React from 'react'
import { View } from 'react-native'
import {
  AmbientLight,
  Fog,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SpotLight,
} from 'three'

export function Globe() {
  let timeout: number

  // Clear the animation loop when the component unmounts
  React.useEffect(() => () => void clearTimeout(timeout), [])

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={async (gl) => {
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
          const sceneColor = 0x330033

          const renderer = new Renderer({ gl })
          renderer.setSize(width, height)
          renderer.setClearColor(sceneColor)

          const scene = new Scene()
          scene.fog = new Fog(sceneColor, 1, 10000)

          const earth = new Earth()
          scene.add(earth)

          const ambientLight = new AmbientLight(0x101010)
          scene.add(ambientLight)

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000)
          const spotLight = new SpotLight(0xff00ff, 1)
          camera.add(spotLight)
          scene.add(camera)

          const render = () => {
            timeout = requestAnimationFrame(render)
            renderer.render(scene, camera)
            gl.endFrameEXP()
          }
          render()
        }}
      />
    </View>
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
