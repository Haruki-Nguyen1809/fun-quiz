import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SelectionScreen from '../SelectionScreen.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SelectionScreen />
  </StrictMode>,
)
