import { useCallback, useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { LocateFixed, MapPin, Navigation, Star, Truck } from 'lucide-react'
import { MapView } from '../components/MapView'
import { EmptyState, Notice, PageHero, ProfessionalCard } from '../components/UI'
import { useDemo } from '../contexts/DemoContext'
import type { Vehicle } from '../types'
import { money, straightLineKm, validWhatsApp } from '../utils/format'
import { ratingSummary } from '../utils/accessRules'

export function Search() {
  const { professionals, driverApplications, reviews } = useDemo()
  const [params] = useSearchParams()
  const [region, setRegion] = useState(params.get('regiao') || '')
  const [vehicle, setVehicle] = useState<Vehicle | ''>('')
  const [available, setAvailable] = useState(false)
  const [maxPrice, setMaxPrice] = useState('')
  const [maxDistance, setMaxDistance] = useState('')
  const [minRating, setMinRating] = useState('')
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState('')
  const [selectedId, setSelectedId] = useState<string>()
  const locate = () => {
    if (!navigator.geolocation) { setLocationError('Geolocalização não disponível neste navegador. Use a busca manual.'); return }
    navigator.geolocation.getCurrentPosition(p => { setPosition({ lat: p.coords.latitude, lng: p.coords.longitude }); setLocationError('') }, () => setLocationError('Localização não autorizada ou indisponível. Use a busca manual.'), { enableHighAccuracy: false, timeout: 10000 })
  }
  const filtered = useMemo(() => professionals.filter(p => {
    const text = `${p.region} ${p.city}`.toLocaleLowerCase('pt-BR')
    const approved = driverApplications.some(a => a.professionalId === p.id && a.status === 'aprovado')
    const rating = ratingSummary(reviews.filter(r => r.professionalId === p.id))
    return approved && (!region || text.includes(region.toLocaleLowerCase('pt-BR'))) && (!vehicle || p.vehicles.includes(vehicle)) && (!available || p.available) && (!maxPrice || p.price <= Number(maxPrice)) && (!maxDistance || !position || straightLineKm(position, p) <= Number(maxDistance)) && (!minRating || rating.average >= Number(minRating))
  }), [professionals, driverApplications, reviews, region, vehicle, available, maxPrice, maxDistance, position, minRating])
  const onSelect = useCallback((id: string) => setSelectedId(id), [])
  return <><PageHero eyebrow="REDE DE APOIO" title="Encontre quem pode ajudar." description="Explore perfis fictícios, ajuste os filtros e selecione marcadores no mapa. Valores e disponibilidade são demonstrativos."/><div className="page-wrap py-12"><div className="surface grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6"><label className="field">Região ou cidade<input className="input" value={region} onChange={e => setRegion(e.target.value)} placeholder="Ex.: São Paulo"/></label><label className="field">Veículo<select className="input" value={vehicle} onChange={e => setVehicle(e.target.value as Vehicle | '')}><option value="">Todos</option>{['Carro','Moto','Utilitário','Caminhão'].map(v => <option key={v}>{v}</option>)}</select></label><label className="field">Preço máximo (R$)<input className="input" type="number" min="1" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Sem limite"/></label><label className="field">Distância em linha reta<select className="input" value={maxDistance} onChange={e => setMaxDistance(e.target.value)}><option value="">Sem limite</option><option value="10">Até 10 km</option><option value="30">Até 30 km</option><option value="100">Até 100 km</option></select></label><label className="field">Avaliação mínima<select className="input" value={minRating} onChange={e => setMinRating(e.target.value)}><option value="">Todas</option><option value="4">4+ estrelas</option><option value="4.5">4,5+ estrelas</option><option value="5">5 estrelas</option></select></label><div className="flex flex-col justify-end gap-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} className="accent-lime"/> Disponíveis</label><button onClick={locate} className="btn-secondary !min-h-10 text-xs"><LocateFixed size={15}/> Usar localização</button></div></div>{locationError && <div className="mt-4"><Notice tone="error">{locationError}</Notice></div>}{maxDistance && !position && <div className="mt-4"><Notice>Autorize a localização para aplicar o filtro de distância. A busca manual segue disponível.</Notice></div>}<div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]"><div className="lg:sticky lg:top-24 lg:self-start"><MapView professionals={filtered} selectedId={selectedId} onSelect={onSelect} userPosition={position}/></div><div><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-bold">{filtered.length} {filtered.length === 1 ? 'profissional encontrado' : 'profissionais encontrados'}</h2><span className="text-xs text-slate-400">Dados de demonstração</span></div>{filtered.length ? <div className="space-y-4">{filtered.map(p => <div key={p.id}><ProfessionalCard professional={p} reviews={reviews} selected={selectedId === p.id} onSelect={() => setSelectedId(p.id)}/>{position && <p className="mt-2 text-xs text-cyan"><Navigation size={12} className="mr-1 inline"/>{straightLineKm(position, p).toFixed(1)} km em linha reta (aprox.)</p>}</div>)}</div> : <EmptyState title="Nenhum profissional encontrado" text="Tente ampliar a região ou ajustar os filtros. Nenhum resultado fictício foi adicionado automaticamente."/>}</div></div></div></>
}

export function ProfessionalDetail() {
  const { id } = useParams()
  const { professionals, driverApplications, reviews } = useDemo()
  const p = professionals.find(item => item.id === id)
  if (!p) return <div className="page-wrap py-20"><EmptyState title="Profissional não encontrado" text="Este perfil não existe na demonstração." action="Voltar à busca" to="/buscar-guincho"/></div>
  const whatsApp = validWhatsApp(p.phone)
  const summary = ratingSummary(reviews.filter(r => r.professionalId === p.id))
  const contractable = p.available && driverApplications.some(a => a.professionalId === p.id && a.status === 'aprovado')
  return <><PageHero eyebrow="PERFIL DO PROFISSIONAL • DEMO" title={p.name} description={p.about}/>
    <div className="page-wrap grid gap-8 py-14 lg:grid-cols-[1.2fr_.8fr]"><div className="space-y-5">
      <div className="surface p-7"><h2 className="text-xl font-bold">Visão geral</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><div className="flex items-center gap-3"><MapPin className="text-cyan"/><div><p className="text-xs text-slate-400">Região</p><p>{p.region}</p></div></div><div className="flex items-center gap-3"><Truck className="text-cyan"/><div><p className="text-xs text-slate-400">Guincho</p><p>{p.towType}</p></div></div><div className="flex items-center gap-3"><Star className="text-cyan"/><div><p className="text-xs text-slate-400">Avaliação fictícia</p><p>{summary.count ? summary.average.toFixed(1) : 'Novo perfil'} / 5 • {summary.count} avaliações</p></div></div><div><p className="text-xs text-slate-400">Veículos atendidos</p><p>{p.vehicles.join(', ')}</p></div></div></div>
      <section id="avaliacoes" className="surface scroll-mt-24 p-7"><p className="eyebrow">EXPERIÊNCIAS DEMONSTRATIVAS</p><h2 className="mt-3 text-2xl font-bold">Avaliações do profissional</h2><p className="mt-3 text-cyan">{summary.count ? summary.average.toFixed(1) : '—'} / 5 • {summary.count} avaliações fictícias</p><div className="mt-5 space-y-2">{summary.distribution.map(item => <div key={item.score} className="flex items-center gap-3 text-sm"><span className="w-8">{item.score} ★</span><div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-700"><div className="h-full rounded-full bg-cyan" style={{ width: summary.count ? `${item.count / summary.count * 100}%` : '0%' }}/></div><span className="w-8 text-right">{item.count}</span></div>)}</div><div className="mt-7 space-y-3">{reviews.filter(r => r.professionalId === p.id).slice().reverse().map(r => <article key={r.id} className="rounded-xl border border-white/10 p-4"><strong className="text-cyan">{'★'.repeat(r.score)}{'☆'.repeat(5 - r.score)} • {r.score}/5</strong><p className="mt-2 text-sm">{r.comment || 'Sem comentário.'}</p><p className="mt-2 text-xs text-slate-400">{new Date(r.createdAt).toLocaleDateString('pt-BR')} • {r.demo ? 'Avaliação demonstrativa' : 'Avaliação local'}</p></article>)}</div></section>
      <Notice>Valores, avaliações e perfis são ilustrativos. A proposta final depende do chamado criado nesta demonstração.</Notice></div>
      <aside className="surface h-fit p-7"><span className={`text-sm font-bold ${contractable ? 'text-cyan' : 'text-slate-400'}`}>{contractable ? '● Aprovado e disponível' : '● Indisponível para contratação'}</span><p className="mt-6 text-sm text-slate-400">Valor ilustrativo a partir de</p><p className="text-4xl font-black text-cyan">{money(p.price)}</p>{contractable && <Link to={`/solicitar-guincho?guincheiro=${encodeURIComponent(p.id)}`} className="btn-primary mt-7 w-full">Solicitar atendimento</Link>}{whatsApp && contractable && <a href={whatsApp} target="_blank" rel="noreferrer" className="btn-secondary mt-3 w-full">Conversar no WhatsApp</a>}<p className="mt-5 text-xs text-slate-400">Solicitações funcionam apenas neste navegador.</p></aside></div></>
}
