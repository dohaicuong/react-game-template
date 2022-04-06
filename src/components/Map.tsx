import { useTexture } from '@react-three/drei'
import { Vector3 } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { LinearMipMapLinearFilter, NearestFilter, Vector2 } from 'three'

const Map = () => {
  return (
    <>
      {Array(51).fill(1).map((_, x) => {
        return Array(37).fill(1).map((_, y) => {
          return <Glass key={`${x}_${y}`} position={[x - 25, y - 18, 0]} />
        })
      })}
      <Water position={[-25, -18, 0]} />
    </>
  )
}


export default Map

type GlassProps = {
  position?: Vector3
}
const Glass: React.FC<GlassProps> = ({ position }) => {
  const texture = useTexture('assets/Tileset/tileset.png')
  const map = useMemo(() => texture.clone(), [])

  useEffect(() => {
    map.magFilter = NearestFilter
    map.minFilter = LinearMipMapLinearFilter

    map.repeat = new Vector2(
      1 / (map.image.width / 12),
      1 / (map.image.height / 12)
    )

    map.offset = new Vector2(
      49 / map.image.width,
      385 / map.image.height,
    )
  }, [])

  return (
    <sprite position={position} scale={1}>
      <boxGeometry />
      <spriteMaterial map={map} />
    </sprite>
  )
}

type WaterProps = {
  position?: Vector3
}
const Water: React.FC<WaterProps> = ({ position }) => {
  const texture = useTexture('assets/Tileset/tileset.png')
  const map = useMemo(() => texture.clone(), [])

  useEffect(() => {
    map.magFilter = NearestFilter
    map.minFilter = LinearMipMapLinearFilter

    map.repeat = new Vector2(
      1 / (map.image.width / 12),
      1 / (map.image.height / 12)
    )

    map.offset = new Vector2(
      49 / map.image.width,
      372 / map.image.height,
    )
  }, [])

  return (
    <sprite position={position} scale={1}>
      <boxGeometry />
      <spriteMaterial map={map} />
    </sprite>
  )
}