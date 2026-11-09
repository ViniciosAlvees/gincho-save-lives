import { useState } from 'react'
import { MapPin, Radio, ShieldCheck } from 'lucide-react'
import towTruck from '../assets/hero-tow-truck-blue.png'

export function HeroAnimation() {
  const [skipped, setSkipped] = useState(false)

  return <div className={`hero-scene ${skipped ? 'intro-skipped' : ''}`} role="group" aria-label="Cena animada de um guincho em uma estrada digital">
    <div className="hero-scene__aura" aria-hidden="true"/>
    <div className="hero-scene__rings" aria-hidden="true"><span/><span/><span/></div>
    <div className="hero-scene__horizon" aria-hidden="true"/>
    <div className="hero-scene__road" aria-hidden="true"><span className="hero-scene__lane"/><span className="hero-scene__lane"/></div>
    <svg className="hero-scene__route" viewBox="0 0 700 350" fill="none" aria-hidden="true"><path className="route-base" d="M20 280 C135 210 155 315 270 235 S420 205 475 135 S605 96 678 45"/><path className="route-flow" d="M20 280 C135 210 155 315 270 235 S420 205 475 135 S605 96 678 45"/></svg>
    <div className="hero-scene__truck-wrap"><img src={towTruck} className="hero-scene__truck" alt="Guincho futurista grafite com detalhes azul elétrico e ciano" fetchPriority="high"/></div>
    <div className="hero-scene__pin"><span className="hero-scene__pin-icon"><MapPin size={19} fill="currentColor"/></span><span>AJUDA LOCALIZADA</span></div>
    <div className="hero-scene__telemetry hero-scene__telemetry--top"><Radio size={15}/><span>REDE ATIVA</span><span className="status-dot"/></div>
    <div className="hero-scene__telemetry hero-scene__telemetry--bottom"><ShieldCheck size={15}/><span>CONEXÃO DEMONSTRATIVA</span></div>
    <div className="hero-scene__wordmark"><span>SISTEMA CONECTADO</span><strong>GUINCHO <em>SAVE LIVES</em></strong></div>
    <button onClick={() => setSkipped(true)} className="hero-scene__skip" disabled={skipped}>{skipped ? 'Animação pulada' : 'Pular animação'}</button>
    <span className="hero-scene__disclaimer">Simulação visual. Sem conexão com serviço real.</span>
  </div>
}
