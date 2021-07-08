import { THREE, TextureLoader } from 'expo-three'

export const getEarthFromAfar = () => {
  const geometry = new THREE.SphereGeometry(2, 128, 128)

  const materials = new THREE.MeshPhongMaterial({
    color: new THREE.Color(0xcad2df),
    map: new TextureLoader().load(
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./assets/globe-light-landmass-invert.png')
    ),
    shininess: 0.9,
    flatShading: false,
    side: THREE.FrontSide,
  })

  return new THREE.Mesh(geometry, materials)
}
