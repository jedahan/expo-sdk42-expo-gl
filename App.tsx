import React, { useState } from 'react'
import { useWindowDimensions, View, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl'
import { Renderer, TextureLoader } from 'expo-three'
import {
  AmbientLight,
  Fog,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SpotLight,
  Texture,
} from 'three'

const Drawer = createDrawerNavigator()

export default function App() {
  const [mapReady, setMapReady] = useState(false)
  const width = useWindowDimensions().width - 96

  const map = new TextureLoader().load(
    require('./assets/globe-light-landmass-invert.png'),
    (texture) => {
      setMapReady(texture ? true : false)
      console.log(texture)
    }
  )

  if (!mapReady) return null

  if (!map.image.data.localUri.endsWith(map.image.data.type))
    map.image.data.localUri += `.${map.image.data.type}`

  if (!map.image.data.uri.endsWith(map.image.data.type))
    map.image.data.uri += `.${map.image.data.type}`

  return (
    <NavigationContainer>
      <Drawer.Navigator
        openByDefault={true}
        drawerContent={() => (
          <View
            style={{
              flex: 1,
              paddingVertical: 48,
              paddingHorizontal: 18,
              backgroundColor: 'green',
            }}
          >
            <Text style={{ fontSize: 50, color: 'red' }}> drawer </Text>
          </View>
        )}
        edgeWidth={0}
        drawerStyle={{ width }}
        screenOptions={{ unmountOnBlur: false }}
      >
        <Drawer.Screen name="Main">{() => Globe(map)}</Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function Globe(map: Texture) {
  let contextCreate = 0

  return (
    <View style={{ flex: 1 }}>
      <GLView
        style={{ flex: 1 }}
        onContextCreate={(gl: ExpoWebGLRenderingContext) => {
          console.log(`onContextCreate ${++contextCreate}`)
          const { drawingBufferWidth: width, drawingBufferHeight: height } = gl
          const sceneColor = 0x667788

          const renderer = new Renderer({ gl })
          renderer.setSize(width, height)
          renderer.setClearColor(sceneColor)

          const scene = new Scene()
          scene.fog = new Fog(sceneColor, 1, 10000)

          const earth = new Earth(map)
          console.log(earth.material?.map?.image?.data)
          scene.add(earth)

          const ambientLight = new AmbientLight(0x101010)
          scene.add(ambientLight)

          const camera = new PerspectiveCamera(70, width / height, 0.01, 1000)
          camera.position.set(150, 150, 150)
          camera.lookAt(earth.position)
          const spotLight = new SpotLight(0xffddff, 1)
          spotLight.position.set(0, 500, 500)
          camera.add(spotLight)
          scene.add(camera)

          let lastLogDate = Date.now()
          let logCount = 0
          const render = () => {
            if (logCount === 0) {
              console.log(`first render`)
              console.log(earth.material?.map?.image?.data)
              logCount++
            }
            if (Date.now() - lastLogDate >= 6 * 1000) {
              console.log(`render ${++logCount}`)
              console.log(earth.material?.map?.image?.data)
              lastLogDate = Date.now()
            }
            requestAnimationFrame(render)
            earth.rotation.x += 0.005
            earth.rotation.y += 0.0025
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
  constructor(map: Texture) {
    super(new SphereGeometry(100, 128, 128), new MeshPhongMaterial({ map }))
  }
}
