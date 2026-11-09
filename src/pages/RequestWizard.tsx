import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, MapPin, Truck } from 'lucide-react'
import { Notice, PageHero } from '../components/UI'
import { useDemo } from '../contexts/DemoContext'
import type { NewRequest, Vehicle } from '../types'

const steps = ['Localização', 'Veículo', 'Problema', 'Destino', 'Revisão']
const initial: NewRequest = { origin: '', destination: '', vehicle: 'Carro', vehicleDescription: '', problem: '', details: '' }

export function RequestWizard() {
  const { createRequest, professionals, driverApplications, role, setRole } = useDemo()
  const [params] = useSearchParams()
  const selected = professionals.find(p => p.id === params.get('guincheiro') && p.available && driverApplications.some(a => a.professionalId === p.id && a.status === 'aprovado'))
  const [data, setData] = useState<NewRequest>({ ...initial, professionalId: selected?.id })
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  function validate(index: number) {
    if (index === 0 && data.origin.trim().length < 5) return 'Informe um local de origem com pelo menos 5 caracteres.'
    if (index === 1 && data.vehicleDescription.trim().length < 3) return 'Descreva o veículo com pelo menos 3 caracteres.'
    if (index === 2 && data.problem.trim().length < 3) return 'Descreva o problema com pelo menos 3 caracteres.'
    if (index === 3 && data.destination.trim().length < 5) return 'Informe um destino com pelo menos 5 caracteres.'
    return ''
  }
  function next(e: FormEvent) { e.preventDefault(); const message = validate(step); setError(message); if (!message) setStep(s => s + 1) }
  function submit() {
    const message = [0,1,2,3].map(validate).find(Boolean)
    if (message) { setError(message); return }
    if (busy) return
    setBusy(true)
    setTimeout(() => { try { if (role !== 'cliente') setRole('cliente'); const id = createRequest(data); navigate(`/solicitacoes/${id}`) } catch (err) { setError(err instanceof Error ? err.message : 'Não foi possível criar a solicitação.'); setBusy(false) } }, 350)
  }
  const update = (field: keyof NewRequest, value: string) => setData(d => ({ ...d, [field]: value }))
  return <><PageHero eyebrow="NOVO ATENDIMENTO • DEMO" title="Vamos colocar você de volta no caminho." description="Preencha as etapas para criar uma solicitação local. Não há envio a profissionais reais."/><div className="page-wrap max-w-4xl py-12"><ol className="mb-8 grid grid-cols-5 gap-1" aria-label="Etapas da solicitação">{steps.map((name, i) => <li key={name} className={`min-w-0 border-t-4 pt-3 text-center text-[10px] sm:text-sm ${i <= step ? 'border-lime text-lime' : 'border-slate-700 text-slate-400'}`}><span className="block font-bold">{i < step ? <Check size={16} className="mx-auto"/> : `0${i + 1}`}</span><span className="hidden sm:block">{name}</span></li>)}</ol><div className="surface p-6 sm:p-9"><p className="eyebrow">ETAPA {step + 1} DE 5</p><h2 className="mt-2 text-2xl font-bold">{steps[step]}</h2>{selected && <p className="mt-2 text-sm text-cyan">Profissional de interesse: {selected.name}. O chamado continua visível para outros profissionais na demonstração.</p>}{step < 4 ? <form onSubmit={next} className="mt-7 space-y-5">{step === 0 && <><label className="field">Local de origem<input className="input" value={data.origin} onChange={e => update('origin', e.target.value)} required minLength={5} maxLength={160} placeholder="Rua, número, bairro e cidade"/></label><Notice>Digite o endereço manualmente. O formulário não acessa sua localização automaticamente.</Notice></>}{step === 1 && <><label className="field">Tipo de veículo<select className="input" value={data.vehicle} onChange={e => update('vehicle', e.target.value)}>{(['Carro','Moto','Utilitário','Caminhão'] as Vehicle[]).map(v => <option key={v}>{v}</option>)}</select></label><label className="field">Descrição do veículo<input className="input" value={data.vehicleDescription} onChange={e => update('vehicleDescription', e.target.value)} required minLength={3} maxLength={120} placeholder="Ex.: hatch prata, modelo e ano"/></label></>}{step === 2 && <><label className="field">O que aconteceu?<select className="input" value={data.problem} onChange={e => update('problem', e.target.value)} required><option value="">Selecione</option><option>Pane mecânica</option><option>Pane elétrica</option><option>Pneu danificado</option><option>Acidente</option><option>Outro</option></select></label><label className="field">Detalhes adicionais (opcional)<textarea className="input min-h-28" maxLength={500} value={data.details} onChange={e => update('details', e.target.value)} placeholder="Informações que ajudem o atendimento"/></label></>}{step === 3 && <label className="field">Destino desejado<input className="input" value={data.destination} onChange={e => update('destination', e.target.value)} required minLength={5} maxLength={160} placeholder="Oficina ou endereço de destino"/></label>}{error && <Notice tone="error">{error}</Notice>}<div className="flex flex-wrap justify-between gap-3 pt-3">{step > 0 ? <button type="button" onClick={() => { setError(''); setStep(s => s - 1) }} className="btn-secondary"><ArrowLeft size={17}/> Voltar</button> : <span/>}<button className="btn-primary">Próxima etapa <ArrowRight size={17}/></button></div></form> : <div className="mt-7 space-y-5"><div className="grid gap-4 sm:grid-cols-2">{[[MapPin,'Origem',data.origin], [Truck,'Veículo',`${data.vehicle} • ${data.vehicleDescription}`], [Truck,'Problema',data.problem], [MapPin,'Destino',data.destination]].map(([Icon,label,value]) => { const Component = Icon as typeof MapPin; return <div key={label as string} className="rounded-xl border border-white/10 bg-ink p-4"><Component size={18} className="mb-2 text-cyan"/><span className="block text-xs text-slate-400">{label as string}</span><strong className="break-words">{value as string}</strong></div> })}</div>{data.details && <p className="text-sm text-slate-300">Detalhes: {data.details}</p>}<Notice>Ao confirmar, o chamado será salvo somente neste navegador. Depois, alterne para o perfil de guincheiro para enviar uma proposta.</Notice>{error && <Notice tone="error">{error}</Notice>}<div className="flex flex-wrap justify-between gap-3 pt-3"><button onClick={() => setStep(3)} className="btn-secondary"><ArrowLeft size={17}/> Editar</button><button disabled={busy} onClick={submit} className="btn-primary">{busy ? 'Criando...' : 'Confirmar solicitação'} <Check size={17}/></button></div></div>}</div></div></>
}
