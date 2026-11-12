import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Notice, PageHero } from '../components/UI'
import { apiService } from '../services/towService'
import type { NewRequest, Professional, TowRequest, Vehicle } from '../types'
import { money } from '../utils/format'

const initialRequest: NewRequest = { origin: '', destination: '', vehicle: 'Carro', vehicleDescription: '', problem: '', details: '' }

export function ApiModePage() {
  const { pathname } = useLocation()
  const { id } = useParams()
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading')
  const [message, setMessage] = useState('')
  const [attempt, setAttempt] = useState(0)
  const listing = pathname === '/buscar-guincho' || pathname.startsWith('/guincheiros/')
  const creating = pathname === '/solicitar-guincho'
  useEffect(() => {
    if (!listing) return
    let active = true
    apiService.getProfessionals().then(data => {
      if (active) { setProfessionals(data); setState('ready') }
    }).catch(error => {
      if (active) { setState('error'); setMessage(error instanceof Error ? error.message : 'Não foi possível consultar os profissionais.') }
    })
    return () => { active = false }
  }, [listing, attempt])
  const visible = id ? professionals.filter(p => p.id === id) : professionals
  return <>
    <PageHero eyebrow="DADOS DA API" title={creating ? 'Solicitar atendimento.' : listing ? 'Profissionais de guincho.' : 'Integração em preparação.'} description="Este modo utiliza a API configurada pela equipe. Falhas de conexão nunca são substituídas por dados demonstrativos."/>
    <div className="page-wrap space-y-6 py-12">
      {listing && <div aria-busy={state === 'loading'}>
        {state === 'loading' && <Notice>Carregando profissionais...</Notice>}
        {state === 'error' && <div className="space-y-4"><Notice tone="error">{message}</Notice><button className="btn-secondary" onClick={() => { setState('loading'); setAttempt(a => a + 1) }}>Tentar novamente</button></div>}
        {state === 'ready' && !visible.length && <Notice>{id ? 'Profissional não encontrado.' : 'Nenhum profissional retornado pela API.'}</Notice>}
        {state === 'ready' && <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visible.map(p => <article key={p.id} className="surface flex flex-col p-6">
          <h2 className="break-words text-xl font-bold">{p.name}</h2>
          <p className="mt-2 break-words text-slate-300">{p.region} • {p.city}</p>
          <p className="mt-3 text-sm text-slate-400">{p.about}</p>
          <p className="mt-3 text-sm">{p.vehicles.join(' • ')} • {p.towType}</p>
          <p className="mt-3 font-bold text-cyan">A partir de {money(p.price)}</p>
          <p className="mt-2 text-sm">{p.available ? 'Disponível' : 'Indisponível'}</p>
          <div className="mt-auto flex flex-wrap gap-3 pt-5">{!id && <Link className="btn-secondary" to={`/guincheiros/${encodeURIComponent(p.id)}`}>Ver perfil</Link>}{p.available && <Link className="btn-primary" to={`/solicitar-guincho?guincheiro=${encodeURIComponent(p.id)}`}>Solicitar guincho</Link>}</div>
        </article>)}</div>}
      </div>}
      {creating && <ApiRequestForm/>}
      {!listing && !creating && <div className="space-y-4"><Notice>Esta área depende do contrato de autenticação e das operações específicas do backend Java. A busca e o formulário de solicitação estão preparados para chamadas remotas.</Notice><div className="flex flex-wrap gap-3"><Link className="btn-primary" to="/buscar-guincho">Consultar profissionais</Link><Link className="btn-secondary" to="/solicitar-guincho">Criar solicitação</Link></div></div>}
    </div>
  </>
}

function ApiRequestForm() {
  const { search } = useLocation()
  const professionalId = new URLSearchParams(search).get('guincheiro') || undefined
  const [data, setData] = useState<NewRequest>(initialRequest)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<TowRequest | null>(null)
  const update = (field: keyof NewRequest, value: string) => setData(previous => ({ ...previous, [field]: value }))
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (busy || created) return
    if (data.origin.trim().length < 5 || data.destination.trim().length < 5 || data.vehicleDescription.trim().length < 3 || data.problem.trim().length < 3) {
      setError('Informe origem e destino com pelo menos 5 caracteres, veículo e problema com pelo menos 3 caracteres.'); return
    }
    setBusy(true); setError('')
    try {
      const result = await apiService.createRequest({ ...data, origin: data.origin.trim(), destination: data.destination.trim(), vehicleDescription: data.vehicleDescription.trim(), problem: data.problem.trim(), details: data.details.trim(), ...(professionalId ? { professionalId } : {}) })
      setCreated(result)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível enviar a solicitação. Seus campos foram mantidos.') }
    finally { setBusy(false) }
  }
  return <form onSubmit={submit} className="surface mx-auto max-w-3xl space-y-5 p-6 sm:p-9" aria-busy={busy}>
    <h2 className="text-2xl font-bold">Dados do atendimento</h2>
    <p className="text-sm text-slate-300">Revise os dados antes de confirmar. A solicitação será enviada para registro no serviço da equipe.</p>
    <fieldset disabled={busy || !!created} className="space-y-5">
      <label className="field">Local de origem<input className="input" required minLength={5} maxLength={160} value={data.origin} onChange={e => update('origin', e.target.value)}/></label>
      <label className="field">Destino desejado<input className="input" required minLength={5} maxLength={160} value={data.destination} onChange={e => update('destination', e.target.value)}/></label>
      <label className="field">Tipo de veículo<select className="input" value={data.vehicle} onChange={e => update('vehicle', e.target.value)}>{(['Carro', 'Moto', 'Utilitário', 'Caminhão'] as Vehicle[]).map(vehicle => <option key={vehicle}>{vehicle}</option>)}</select></label>
      <label className="field">Descrição do veículo<input className="input" required minLength={3} maxLength={120} value={data.vehicleDescription} onChange={e => update('vehicleDescription', e.target.value)}/></label>
      <label className="field">Problema<input className="input" required minLength={3} maxLength={160} value={data.problem} onChange={e => update('problem', e.target.value)}/></label>
      <label className="field">Detalhes adicionais (opcional)<textarea className="input min-h-28" maxLength={500} value={data.details} onChange={e => update('details', e.target.value)}/></label>
      <button disabled={busy || !!created} className="btn-primary w-full">{busy ? 'Enviando solicitação...' : created ? 'Solicitação enviada' : 'Confirmar solicitação'}</button>
    </fieldset>
    {error && <Notice tone="error">{error}</Notice>}
    {created && <><Notice tone="success">Solicitação {created.id} registrada pela API. Status: {created.status}.</Notice><button type="button" className="btn-secondary" onClick={() => { setCreated(null); setData(initialRequest) }}>Criar outra solicitação</button></>}
  </form>
}
