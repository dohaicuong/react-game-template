import { Suspense } from 'react'
import Map from './components/Map'

import Player from './components/Player'
// import Anvil from './components/Anvil'

const App = () => {
  return (
    <>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Player />
        <Map />
      </Suspense>
    </>
  )
}

export default App

