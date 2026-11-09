import { useEffect, useRef, useState } from 'react'
import type { Professional } from '../types'
import { Notice } from './UI'

export function MapView({ professionals, selectedId, onSelect, userPosition }: { professionals: Professional[]; selectedId?: string; onSelect: (id: string) => void; userPosition?: { lat: number; lng: number } | null }) {
  const element = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import('leaflet').Map | null>(null)
  const markersRef = useRef<import('leaflet').LayerGroup | null>(null)
  const [error, setError] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!element.current || mapRef.current) return
    let active = true
    import('leaflet').then(L => {
      if (!active || !element.current) return
      const map = L.map(element.current, { scrollWheelZoom: false }).setView([-23.5505, -46.6333], 10)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>', maxZoom: 18 }).on('tileerror', () => setError(true)).addTo(map)
      mapRef.current = map
      markersRef.current = L.layerGroup().addTo(map)
      setReady(true)
    }).catch(() => setError(true))
    return () => { active = false; mapRef.current?.remove(); mapRef.current = null; markersRef.current = null }
  }, [])

  useEffect(() => {
    if (!ready || !mapRef.current || !markersRef.current) return
    let active = true
    import('leaflet').then(L => {
      if (!active || !markersRef.current || !mapRef.current) return
      markersRef.current.clearLayers()
      professionals.forEach(p => {
        const color = p.id === selectedId ? '#40baff' : p.available ? '#00d9ff' : '#81909d'
        L.circleMarker([p.lat, p.lng], { radius: p.id === selectedId ? 12 : 9, color, weight: 3, fillColor: color, fillOpacity: .35 }).addTo(markersRef.current!).bindTooltip(p.name).on('click', () => onSelect(p.id))
      })
      if (userPosition) L.circleMarker([userPosition.lat, userPosition.lng], { radius: 8, color: '#fff', fillColor: '#40baff', fillOpacity: 1 }).addTo(markersRef.current).bindTooltip('Sua localização aproximada')
      const selected = professionals.find(p => p.id === selectedId)
      if (selected) mapRef.current.setView([selected.lat, selected.lng], 12)
      else if (professionals.length) mapRef.current.fitBounds(L.latLngBounds(professionals.map(p => [p.lat, p.lng])), { padding: [35, 35], maxZoom: 11 })
    })
    return () => { active = false }
  }, [ready, professionals, selectedId, onSelect, userPosition])

  return <div className="space-y-2">
    <div className="map-shell">
      <div className="map-shell__heading" aria-hidden="true"><span className="status-dot"/> MAPA DEMONSTRATIVO <span className="map-shell__coordinates">DADOS FICTÍCIOS</span></div>
      <div ref={element} className="map-shell__canvas h-[320px] overflow-hidden bg-panel sm:h-[440px]" role="region" aria-label="Mapa interativo com marcadores fictícios de guincheiros"/>
      <span className="map-shell__corner map-shell__corner--tl" aria-hidden="true"/><span className="map-shell__corner map-shell__corner--br" aria-hidden="true"/>
    </div>
    {error && <Notice tone="error">Mapa indisponível. A lista de profissionais continua funcionando.</Notice>}
    <p className="text-xs text-slate-400">Marcadores fictícios • mapa © OpenStreetMap contributors • distâncias em linha reta, não rodoviárias.</p>
  </div>
}
