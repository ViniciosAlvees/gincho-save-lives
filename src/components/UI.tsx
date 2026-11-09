import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Radar, Star, Truck } from 'lucide-react'
import type { Professional, Review, Status } from '../types'
import { money } from '../utils/format'
import { ratingSummary } from '../utils/accessRules'

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="page-hero">
    <div className="page-wrap relative z-10">
      <div className="page-hero__index"><span>GSL / INTERFACE</span><span>2026.2</span></div>
      <p className="eyebrow mt-8">{eyebrow}</p>
      <h1 className="section-title mt-4">{title}</h1>
      <p className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">{description}</p>
    </div>
    <div className="page-hero__signal" aria-hidden="true"><Radar size={43} strokeWidth={1.25}/></div>
  </section>
}

export function EmptyState({ title, text, action, to }: { title: string; text: string; action?: string; to?: string }) {
  return <div className="surface p-8 text-center"><Truck className="mx-auto mb-4 text-cyan" size={36}/><h3 className="text-xl font-bold">{title}</h3><p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">{text}</p>{action && to && <Link to={to} className="btn-primary mt-5">{action}<ArrowRight size={16}/></Link>}</div>
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'error' | 'success' }) {
  return <p role={tone === 'error' ? 'alert' : 'status'} className={`rounded-xl border p-3 text-sm ${tone === 'error' ? 'border-red-400/40 bg-red-400/10 text-red-200' : tone === 'success' ? 'border-lime/40 bg-lime/10 text-lime' : 'border-cyan/30 bg-cyan/8 text-cyan'}`}>{children}</p>
}

export function StatusBadge({ status }: { status: Status }) {
  const green = ['confirmado', 'a caminho', 'em andamento', 'concluído'].includes(status)
  return <span className={`status-badge inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${green ? 'border-lime/40 bg-lime/10 text-lime' : status === 'cancelado' ? 'border-red-400/40 bg-red-400/10 text-red-300' : 'border-cyan/40 bg-cyan/10 text-cyan'}`}>{status}</span>
}

export function ProfessionalCard({ professional, reviews, selected, onSelect }: { professional: Professional; reviews: Review[]; selected?: boolean; onSelect?: () => void }) {
  const rating = ratingSummary(reviews.filter(r => r.professionalId === professional.id))
  return <article className={`surface surface-hover p-5 ${selected ? '!border-cyan' : ''}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex items-center gap-3"><div className="flex size-12 items-center justify-center rounded-xl bg-cyan/10 text-cyan"><Truck size={24}/></div><div><h3 className="font-bold">{professional.name}</h3><p className="text-xs text-slate-400">Perfil demonstrativo</p></div></div><span className={`rounded-full px-2 py-1 text-[11px] font-bold ${professional.available ? 'bg-cyan/10 text-cyan' : 'bg-slate-700 text-slate-300'}`}>{professional.available ? 'Disponível' : 'Indisponível'}</span></div>
    <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-300"><span className="inline-flex items-center gap-1"><MapPin size={14} className="text-cyan"/>{professional.region}</span><span className="inline-flex items-center gap-1"><Star size={14} className="text-cyan"/>{rating.count ? rating.average.toFixed(1) : 'Novo'} / 5 • {rating.count} avaliações fictícias</span><span>{professional.towType}</span></div><p className="mt-4 text-sm text-slate-400">{professional.vehicles.join(' • ')}</p>
    <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4"><div><p className="text-xs text-slate-400">A partir de • valor ilustrativo</p><strong className="text-xl text-cyan">{money(professional.price)}</strong></div><div className="flex flex-wrap gap-2">{onSelect && <button onClick={onSelect} className="btn-secondary !min-h-9 !px-3 text-xs">Ver no mapa</button>}<Link className="btn-secondary !min-h-9 !px-3 text-xs" to={`/guincheiros/${professional.id}#avaliacoes`}>Ver avaliações</Link>{professional.available && <Link className="btn-primary !min-h-9 !px-3 text-xs" to={`/solicitar-guincho?guincheiro=${professional.id}`}>Solicitar guincho</Link>}<Link className="btn-ghost !min-h-9 !px-3 text-xs" to={`/guincheiros/${professional.id}`}>Ver perfil</Link></div></div>
  </article>
}
