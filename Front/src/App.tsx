import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

function App() {
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    if(map.current) return;
    
    
    map.current = L.map('map', {
      center: [51.505, -0.09],
      zoom: 13
    })

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.current)
  }, [])


  return (
    <div id='map' style={{height: '100vh', width: '100vw'}}>
    </div>
  )
}

export default App
