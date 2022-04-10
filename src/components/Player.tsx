import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { LinearMipMapLinearFilter, NearestFilter, Sprite, Texture, Vector2 } from 'three'

const frameWidth = 48
const frameHeight = 48
const frameRate = 250

const Player = () => {
  const playerRef = useRef<Sprite>()
  const texture = useTexture('assets/heroes/sprites/sorc.png')

  usePrepareTexture(texture, [frameWidth, frameHeight])
  useAnimateTexture(playerRef, frameRate)
  
  const currentDirectionFrame = useRef<number>(11)
  const { forward, backward, left, right, attack } = usePersonControls()
  const movingSpeed = 0.1

  useFrame(() => {
    if (!forward && !backward && !left && !right) return
    if (!playerRef.current) return

    if (forward) playerRef.current.position.y += movingSpeed
    if (backward) playerRef.current.position.y -= movingSpeed
    if (right) playerRef.current.position.x += movingSpeed
    if (left) playerRef.current.position.x -= movingSpeed
  })

  useEffect(() => {
    if (!playerRef.current?.material.map) return
    
    currentDirectionFrame.current =
      forward ? 8 :
      backward ? 11 :
      left ? 10 :
      right ? 9 :
      currentDirectionFrame.current
    
    texture.offset.y = currentDirectionFrame.current * frameHeight / texture.image.height
  }, [forward, backward, left, right])
  
  return (
    <sprite position={[0, -2, 1]} scale={3} ref={playerRef}>
      <boxGeometry />
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Player

const keys: { [name: string]: string } = {
  KeyW: 'forward',
  KeyS: 'backward',
  KeyA: 'left',
  KeyD: 'right',
  KeyJ: 'attack',
}
const usePersonControls = () => {
  const moveFieldByKey = (key: any) => keys[key]

  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
    attack: false
  })

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }))
    }
    const handleKeyUp = (e: any) => {
      setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }))
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])
  return movement
}

const usePrepareTexture = (texture: Texture, [frameWidth, frameHeight]: [number, number]) => {
  useEffect(() => {
    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter

    texture.repeat = new Vector2(
      1 / (texture.image.width / frameWidth),
      1 / (texture.image.height / frameHeight)
    )

    const xFrame = 0
    const yFrame = 11
    texture.offset = new Vector2(
      xFrame * frameWidth / texture.image.width,
      yFrame * frameHeight / texture.image.height,
    )
  }, [])
}

const useAnimateTexture = (playerRef: React.MutableRefObject<Sprite | undefined>, frameRate: number) => {
  const interval = useRef<number>()
  const currentFrame = useRef<number>(0)

  useFrame(({ clock }) => {
    if (interval.current === undefined) interval.current = clock.oldTime

    if (clock.oldTime >= interval.current + frameRate) {
      interval.current = clock.oldTime

      currentFrame.current = currentFrame.current === 3
        ? 0
        : currentFrame.current + 1

      if (!playerRef.current?.material.map) return

      playerRef.current.material.map.offset.x = currentFrame.current * frameWidth / playerRef.current.material.map.image.width
    }
  })
}
