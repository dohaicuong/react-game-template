import { useTexture } from '@react-three/drei'

const Anvil = () => {
  const texture = useTexture('assets/Objects/Anvil.png')

  return (
    <sprite position={[0, 0, 0]}>
      <boxGeometry />
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Anvil
