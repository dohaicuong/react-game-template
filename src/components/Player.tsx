import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { LinearMipMapLinearFilter, NearestFilter, Vector2 } from 'three'
import { useKeyPress } from 'react-use'

const keys = ['w', 's', 'a', 'd']

const Player = () => {
  const texture = useTexture('assets/heroes/sprites/Sorcerer_idle.png')
  useEffect(() => {
    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter

    const frameWidth = texture.image.width / 4
    const frameHeight = texture.image.height / 4

    texture.repeat = new Vector2(
      1 / (texture.image.width / frameWidth),
      1 / (texture.image.height / frameHeight)
    )

    const xFrame = 0
    const yFrame = 3
    texture.offset = new Vector2(
      xFrame * frameWidth / texture.image.width,
      yFrame * frameHeight / texture.image.height,
    )
  }, [])

  const interval = useRef<number>()
  const currentFrame = useRef<number>(0)
  const currentDirectionFrame = useRef<number>(3)
  const frameRate = 250
  useFrame(({ clock }) => {
    if (interval.current === undefined) interval.current = clock.oldTime

    if (clock.oldTime >= interval.current + frameRate) {
      interval.current = clock.oldTime

      currentFrame.current = currentFrame.current === 3
        ? 0
        : currentFrame.current + 1

      const frameWidth = texture.image.width / 4
      const frameHeight = texture.image.height / 4

      texture.offset = new Vector2(
        currentFrame.current * frameWidth / texture.image.width,
        currentDirectionFrame.current * frameHeight / texture.image.height,
      )
    }
  })

  useKeyPress((event) => {
    const newYFrame =
      event.key === 'w' ? 0 :
      event.key === 'd' ? 1 :
      event.key === 'a' ? 2 :
      event.key === 's' ? 3 :
      currentDirectionFrame.current

    currentDirectionFrame.current = newYFrame

    return true
  })

  return (
    <sprite position={[0, -2, 1]} scale={3}>
      <boxGeometry />
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Player