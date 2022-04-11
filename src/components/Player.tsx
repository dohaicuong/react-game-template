import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { LinearMipMapLinearFilter, NearestFilter, Sprite, Texture, Vector2 } from 'three'

const frameWidth = 48
const frameHeight = 48
const frameRate = 250
const movingSpeed = 0.1

const Player = () => {
  const playerRef = useRef<Sprite>()
  const texture = useTexture('assets/heroes/sprites/sorc.png')

  usePrepareTexture(texture, [frameWidth, frameHeight])
  useAnimateTexture(playerRef, frameRate)
  
  const [yFrame, setYFrame] = useState<number>(11)
  const direction = useControlDirection()
  const action = useControlAction()
  
  useEffect(() => {
    if (action === 'idle') {
      if (direction.down) setYFrame(11)
      if (direction.left) setYFrame(10)
      if (direction.right) setYFrame(9)
      if (direction.up) setYFrame(8)
    }

    if (action === 'walk') {
      if (direction.down) setYFrame(7)
      if (direction.left) setYFrame(6)
      if (direction.right) setYFrame(5)
      if (direction.up) setYFrame(4)
    }

    if (action === 'melee') {
      if (direction.down) setYFrame(3)
      if (direction.left) setYFrame(2)
      if (direction.right) setYFrame(1)
      if (direction.up) setYFrame(0)
    }
  }, [action, direction.up, direction.down, direction.left, direction.right])

  useEffect(() => {
    if (!playerRef.current?.material.map) return

    playerRef.current.material.map.offset.y = yFrame * frameHeight / playerRef.current.material.map.image.height
  }, [yFrame])

  useFrame(() => {
    if (action !== 'walk') return
    if (!direction.up && !direction.down && !direction.left && !direction.right) return
    if (!playerRef.current) return

    if (direction.up) playerRef.current.position.y += movingSpeed
    if (direction.down) playerRef.current.position.y -= movingSpeed
    if (direction.right) playerRef.current.position.x += movingSpeed
    if (direction.left) playerRef.current.position.x -= movingSpeed
  })
  
  return (
    <sprite position={[0, -2, 1]} scale={3} ref={playerRef}>
      <boxGeometry />
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Player

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

type Direction = 'up' | 'down' | 'left' | 'right'
type DirectionState = {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
}
const bindings: { [name: string]: Direction } = {
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
}
const useControlDirection = () => {
  const [direction, setDirection] = useState<DirectionState>({
    up: false,
    down: true,
    left: false,
    right: false,
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setDirection(currentDirection => {
        if (bindings[event.key] === 'up') {
          return { up: true, down: false, left: false, right: false }
        }
        if (bindings[event.key] === 'down') {
          return { up: false, down: true, left: false, right: false }
        }
        if (bindings[event.key] === 'left') {
          return { up: false, down: false, left: true, right: false }
        }
        if (bindings[event.key] === 'right') {
          return { up: false, down: false, left: false, right: true }
        }
        return currentDirection
      })
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return direction
}

type Action = 'idle' | 'walk' | 'melee'
const actionBindings: { [name: string]: Action } = {
  w: 'walk',
  s: 'walk',
  a: 'walk',
  d: 'walk',
  j: 'melee'
}
const useControlAction = () => {
  const [action, setAction] = useState<Action>('idle')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const action = actionBindings[e.key]
      if (!action) return

      setAction(action)
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      setAction('idle')
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return action
}