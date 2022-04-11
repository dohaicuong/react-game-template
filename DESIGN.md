// load texture
const texture = useTexture('assets/heroes/sprites/sorc.png')

// register actions
const animationRegistry = useMemo(() => ({
  texture,
  idle_down: { row: 11, frames: 4 }, // rate: 250
  idle_left: { row: 10, frames: 4 },
  idle_right: { row: 9, frames: 4 },
  idle_up: { row: 8, frames: 4 },
  actions: {
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
const playAction = useAnimations(animationRegistry)

// bind key to direction and action
const keyBindings = useMemo(() => ({
  s: { action: 'walk', y: -1 },
  a: { action: 'walk', x: -1 },
  d: { action: 'walk', x: 1 },
  w: { action: 'walk', y: 1 },
  j: { action: 'melee' }
}), [])
const { direction, action } = useControl(keyBindings)

// animation logic ?? investigate
useEffect(() => {
  const lr = direction.x > 0 ? 'right' : 'left'
  const ud = direction.y > 0 ? 'up' : 'down'
  const direction = Math.abs(lr) > Math.abs(ud) ? lr : ud
  
  const animation = `${action}_${direction}`
  await playAction(animation)
}, [direction, action])

useFrame((_, delta) => {
  playerRef.current.position.x += direction.x * delta
  playerRef.current.position.y += direction.y * delta
})
