import { useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import { useKeyPress } from 'react-use'
import { Sprite } from 'three'
import { AnimationRegistry, useAnimations } from '../hooks/useAnimations'

type Actions =
  | 'walk_down'
  | 'walk_left'
  | 'walk_right'
  | 'walk_up'
  | 'melee_down'
  | 'melee_left'
  | 'melee_right'
  | 'melee_up'

const Player = () => {
  const playerRef = useRef<Sprite>()

  // load resource and cloned texture for this entity
  const originalTexture = useTexture('assets/heroes/sprites/sorc.png')
  const texture = useMemo(() => originalTexture.clone(), [])

  // register actions
  const animationRegistry = useMemo<AnimationRegistry>(() => ({
    texture,
    actions: {
      idle_down: { row: 11, frames: 4, isLooping: true }, // rate: 250
      idle_left: { row: 10, frames: 4 },
      idle_right: { row: 9, frames: 4 },
      idle_up: { row: 8, frames: 4 },
      
      walk_down: { row: 7, frames: 4, isLooping: true },
      walk_left: { row: 6, frames: 4, isLooping: true },
      walk_right: { row: 5, frames: 4, isLooping: true },
      walk_up: { row: 4, frames: 4, isLooping: true },

      melee_down: { row: 3, frames: 4 },
      melee_left: { row: 2, frames: 4 },
      melee_right: { row: 1, frames: 4 },
      melee_up: { row: 0, frames: 4 },
    }
  }), [])
  const playAction = useAnimations<Actions>(animationRegistry)

  const [walkdown] = useKeyPress('s')
  useEffect(() => {
    if (walkdown) playAction('walk_down')
  }, [walkdown])

  const [attackdown] = useKeyPress('j')
  useEffect(() => {
    if (attackdown) playAction('melee_down')
  }, [attackdown])
  
  return (
    <sprite position={[0, 0, 0.1]} scale={3} ref={playerRef}>
      <boxGeometry />
      <spriteMaterial map={texture} />
    </sprite>
  )
}

export default Player
