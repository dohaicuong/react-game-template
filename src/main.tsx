import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { RecoilRoot } from 'recoil'

import App from './App'

const root = document.getElementById('root')
if (!root) throw new Error('Unable to found root element')

createRoot(root).render(
  <Canvas
    // linear
    camera={{
      fov: 150
    }}
  >
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </Canvas>
)
