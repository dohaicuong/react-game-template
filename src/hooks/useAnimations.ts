import { useFrame } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LinearMipMapLinearFilter, NearestFilter, Texture } from 'three'

export type AnimationDefinition = {
  row: number
  frames: number

  isLooping?: boolean
  rate?: number
}

export type AnimationRegistry = {
  texture: Texture
  frameWidth?: number
  frameHeight?: number
  actions: {
    [name: string]: AnimationDefinition
    idle_up: AnimationDefinition
    idle_down: AnimationDefinition
    idle_left: AnimationDefinition
    idle_right: AnimationDefinition
  }
}

type IdleActions = 
  | 'idle_up'
  | 'idle_down'
  | 'idle_left'
  | 'idle_right'

export function useAnimations<Actions>({
  texture,
  frameWidth = 48,
  frameHeight = 48,
  actions,
}: AnimationRegistry): (name: IdleActions | Actions) => void {
  // prepare texture
  useEffect(() => {
    texture.magFilter = NearestFilter
    texture.minFilter = LinearMipMapLinearFilter

    texture.repeat.x = 1 / (texture.image.width / frameWidth)
    texture.repeat.y = 1 / (texture.image.height / frameHeight)
  }, [])

  // playing animation helper
  const [playingAction, setPlayingAction] = useState<string | undefined>('idle_down')
  const playAction = useCallback((name: string) => {
    const action = actions[name]
    if (!action) return

    setPlayingAction(name)
    texture.offset.y = action.row * frameHeight / texture.image.height
  }, [])

  // play the default action
  useEffect(() => playAction('idle_down'), [])

  // animate row of action
  useAnimateAction(
    texture,
    frameWidth,
    actions,
    playingAction,
    (name = '') => {
      const action = actions[name]
      if (action?.isLooping) playAction(name)
      else setPlayingAction('idle_down')
    }
  )

  return playAction as any
}

const useAnimateAction = (
  texture: Texture,
  frameWidth: number,
  actions: { [name: string]: AnimationDefinition },
  actionName?: string,
  onFinished?: (name?: string) => void
) => {
  const interval = useRef<number>()
  const currentFrame = useRef<number>(0)

  useFrame(({ clock }) => {
    if (!actionName) return

    const playingAction = actions[actionName]
    if (!playingAction) return

    const { rate = 250, frames } = playingAction
    if (interval.current === undefined) interval.current = clock.oldTime
    if (clock.oldTime >= interval.current + rate) {
      interval.current = clock.oldTime

      const isLastFrame = currentFrame.current === (frames - 1)
      if (isLastFrame) {
        currentFrame.current = 0
        onFinished?.(actionName)
      }
      else currentFrame.current++

      texture.offset.x = currentFrame.current * frameWidth / texture.image.width
    }
  })
}
