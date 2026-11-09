import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ApprovalStatus, ClientAccount, DemoState, DriverApplication, NewRequest, Professional, Proposal, Review, Role, Status, TowRequest } from '../types'
import { addProposalToRequest, confirmProposal, moveStatus } from '../utils/workflow'
import { canReview, isActiveClient, isApprovedDriver, isContractable } from '../utils/accessRules'
import { loadDemoState, saveDemoState } from '../services/demoService'

interface DemoContextValue extends DemoState {
  clientSessionId: string | null
  driverSessionId: string | null
  employeeDemo: boolean
  registerClient: (data: Omit<ClientAccount, 'id' | 'status' | 'createdAt'>) => string
  loginClient: (email: string) => void
  loginDriver: (email: string) => DriverApplication
  openEmployeeDemo: () => void
  closeSession: () => void
  submitDriverApplication: (professional: Omit<Professional, 'id' | 'demo' | 'jobs'>, application: Omit<DriverApplication, 'id' | 'professionalId' | 'status' | 'createdAt' | 'history'>) => string
  decideApplication: (id: string, status: ApprovalStatus, note: string) => void
  addReview: (requestId: string, score: number, comment: string) => void
  setRole: (role: Role) => void
  updateProfessional: (id: string, updates: Pick<Professional, 'region' | 'available'>) => void
  createRequest: (data: NewRequest) => string
  sendProposal: (requestId: string, amount: number, note: string) => void
  counterProposal: (requestId: string, proposalId: string, amount: number) => void
  rejectProposal: (requestId: string, proposalId: string) => void
  acceptProposal: (requestId: string, proposalId: string) => void
  acceptCounter: (requestId: string, proposalId: string) => void
  changeStatus: (requestId: string, status: Status) => void
  sendMessage: (requestId: string, text: string) => void
}

const DemoContext = createContext<DemoContextValue | null>(null)
const uid = () => crypto.randomUUID()

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(loadDemoState)
  const [clientSessionId, setClientSessionId] = useState<string | null>(null)
  const [driverSessionId, setDriverSessionId] = useState<string | null>(null)
  const [employeeDemo, setEmployeeDemo] = useState(false)
  const stateRef = useRef(state)
  useEffect(() => { stateRef.current = state }, [state])
  useEffect(() => { saveDemoState(state) }, [state])

  const updateRequest = (id: string, transform: (request: TowRequest) => TowRequest) => {
    const previous = stateRef.current
    const target = previous.requests.find(item => item.id === id)
    if (!target) throw new Error('Solicitação não encontrada.')
    const updated = transform(target)
    const next = { ...previous, requests: previous.requests.map(item => item.id === id ? updated : item) }
    stateRef.current = next
    setState(next)
  }
  const current = () => stateRef.current
  const activeClient = () => { const s = current(); if (!isActiveClient(s.clientAccounts.find(a => a.id === clientSessionId), clientSessionId)) throw new Error('Cadastre-se, ative a conta demonstrativa e entre como cliente.') }
  const ownsRequest = (requestId: string) => { activeClient(); if (current().requests.find(r => r.id === requestId)?.clientId !== clientSessionId) throw new Error('Este cliente não participa do atendimento.') }
  const approvedDriver = () => { const s = current(); const p = s.professionals.find(item => item.id === driverSessionId); const application = s.driverApplications.find(item => item.professionalId === driverSessionId); if (!isApprovedDriver(p, application, driverSessionId)) throw new Error('Somente guincheiros aprovados e autenticados podem trabalhar.'); return p! }
  const registerClient = (data: Omit<ClientAccount, 'id' | 'status' | 'createdAt'>) => {
    if (current().clientAccounts.some(a => a.email.toLowerCase() === data.email.toLowerCase())) throw new Error('E-mail já cadastrado nesta demonstração.')
    const id = uid(); const account: ClientAccount = { ...data, id, status: 'ativo', createdAt: new Date().toISOString() }
    setState(s => ({ ...s, clientAccounts: [...s.clientAccounts, account], clientName: data.name })); return id
  }
  const loginClient = (email: string) => { const account = current().clientAccounts.find(a => a.email.toLowerCase() === email.trim().toLowerCase()); if (!account || account.status !== 'ativo') throw new Error('Conta demonstrativa não encontrada ou inativa.'); setClientSessionId(account.id); setDriverSessionId(null); setEmployeeDemo(false); setState(s => ({ ...s, role: 'cliente', clientName: account.name })) }
  const loginDriver = (email: string) => { const application = current().driverApplications.find(a => a.email.toLowerCase() === email.trim().toLowerCase()); if (!application) throw new Error('Cadastro profissional demonstrativo não encontrado.'); setDriverSessionId(application.professionalId); setClientSessionId(null); setEmployeeDemo(false); setState(s => ({ ...s, role: 'guincheiro', professionalId: application.professionalId })); return application }
  const openEmployeeDemo = () => { setEmployeeDemo(true); setClientSessionId(null); setDriverSessionId(null) }
  const closeSession = () => { setClientSessionId(null); setDriverSessionId(null); setEmployeeDemo(false) }
  const setRole = (role: Role) => setState(s => ({ ...s, role }))
  const submitDriverApplication = (professional: Omit<Professional, 'id' | 'demo' | 'jobs'>, application: Omit<DriverApplication, 'id' | 'professionalId' | 'status' | 'createdAt' | 'history'>) => {
    if (current().driverApplications.some(a => a.email.toLowerCase() === application.email.toLowerCase())) throw new Error('E-mail profissional já cadastrado nesta demonstração.')
    const id = uid(); const at = new Date().toISOString()
    setState(s => ({ ...s, professionalId: id, role: 'guincheiro', professionals: [...s.professionals, { ...professional, id, available: false, approvalStatus: 'pendente', demo: true, jobs: 0 }], driverApplications: [...s.driverApplications, { ...application, id: uid(), professionalId: id, status: 'pendente', createdAt: at, history: [{ status: 'pendente', note: 'Cadastro enviado para análise demonstrativa.', at }] }] }))
    return id
  }
  const decideApplication = (id: string, status: ApprovalStatus, note: string) => {
    if (!employeeDemo) throw new Error('Entre no painel demonstrativo de funcionários.')
    if (['reprovado', 'correção solicitada'].includes(status) && !note.trim()) throw new Error('Informe uma justificativa.')
    const target = current().driverApplications.find(a => a.id === id); if (!target) throw new Error('Cadastro não encontrado.')
    if (status === 'aprovado' && !Object.values(target.documents).every(Boolean)) throw new Error('Quatro documentos fictícios são necessários para aprovação demonstrativa.')
    const at = new Date().toISOString()
    setState(s => ({ ...s, driverApplications: s.driverApplications.map(a => a.id === id ? { ...a, status, history: [...a.history, { status, note: note.trim() || 'Decisão demonstrativa.', at }] } : a), professionals: s.professionals.map(p => p.id === target.professionalId ? { ...p, approvalStatus: status, available: status === 'aprovado' ? p.available : false } : p) }))
  }
  const addReview = (requestId: string, score: number, comment: string) => {
    activeClient(); const s = current(); const request = s.requests.find(r => r.id === requestId)
    if (!canReview(request, clientSessionId, s.reviews) || !Number.isInteger(score) || score < 1 || score > 5) throw new Error('Avaliação indisponível para este atendimento.')
    const review: Review = { id: uid(), requestId, professionalId: request!.professionalId!, clientId: clientSessionId!, score, comment: comment.trim().slice(0, 500), createdAt: new Date().toISOString(), demo: true }
    const next = { ...s, reviews: [...s.reviews, review] }; stateRef.current = next; setState(next)
  }
  const updateProfessional = (id: string, updates: Pick<Professional, 'region' | 'available'>) => {
    const p = approvedDriver(); if (p.id !== id) throw new Error('Este perfil não pode ser alterado.')
    setState(s => ({ ...s, professionals: s.professionals.map(p => p.id === id ? { ...p, ...updates } : p) }))
  }
  const createRequest = (data: NewRequest) => {
    activeClient()
    if (data.professionalId) { const selected = current().professionals.find(p => p.id === data.professionalId); if (!selected || !isContractable(selected, current().driverApplications.find(a => a.professionalId === data.professionalId))) throw new Error('Profissional indisponível ou não aprovado.') }
    const id = uid()
    setState(s => ({ ...s, requests: [{ ...data, id, clientId: clientSessionId!, clientName: s.clientName, status: 'aguardando propostas', proposals: [], messages: [], createdAt: new Date().toISOString() }, ...s.requests] }))
    return id
  }
  const sendProposal = (requestId: string, amount: number, note: string) => {
    const driver = approvedDriver(); if (state.role !== 'guincheiro' || !driver.available) throw new Error('Ative sua disponibilidade antes de propor.')
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Informe um valor maior que zero.')
    const proposal: Proposal = { id: uid(), professionalId: driver.id, amount, note, status: 'pendente', createdAt: new Date().toISOString() }
    updateRequest(requestId, r => addProposalToRequest(r, proposal))
  }
  const counterProposal = (requestId: string, proposalId: string, amount: number) => {
    ownsRequest(requestId)
    if (state.role !== 'cliente') throw new Error('Alterne para o perfil de cliente para negociar.')
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Informe um valor válido.')
    updateRequest(requestId, r => {
      if (!['proposta recebida', 'negociação'].includes(r.status)) throw new Error('Negociação encerrada.')
      if (!r.proposals.some(p => p.id === proposalId && p.status === 'pendente')) throw new Error('Proposta indisponível.')
      return { ...r, status: 'negociação', proposals: r.proposals.map(p => p.id === proposalId ? { ...p, counterAmount: amount, status: 'contraproposta' } : p) }
    })
  }
  const rejectProposal = (requestId: string, proposalId: string) => {
    ownsRequest(requestId)
    if (state.role !== 'cliente') throw new Error('Alterne para o perfil de cliente para recusar propostas.')
    updateRequest(requestId, r => {
    if (!['proposta recebida', 'negociação'].includes(r.status)) throw new Error('Negociação encerrada.')
    return { ...r, proposals: r.proposals.map(p => p.id === proposalId ? { ...p, status: 'recusada' } : p) }
    })
  }
  const acceptProposal = (requestId: string, proposalId: string) => {
    ownsRequest(requestId)
    if (state.role !== 'cliente') throw new Error('Alterne para o perfil de cliente para aceitar propostas.')
    updateRequest(requestId, r => confirmProposal(r, proposalId))
  }
  const acceptCounter = (requestId: string, proposalId: string) => {
    const driver = approvedDriver()
    if (state.role !== 'guincheiro') throw new Error('Alterne para o perfil de guincheiro para aceitar a contraproposta.')
    updateRequest(requestId, r => confirmProposal(r, proposalId, true, driver.id))
  }
  const changeStatus = (requestId: string, status: Status) => updateRequest(requestId, r => {
    if (status === 'cancelado') ownsRequest(requestId); else approvedDriver()
    if (status === 'cancelado' ? state.role !== 'cliente' : state.role !== 'guincheiro' || r.professionalId !== driverSessionId) throw new Error('Este perfil não pode atualizar o chamado.')
    return moveStatus(r, status)
  })
  const sendMessage = (requestId: string, text: string) => updateRequest(requestId, r => {
    if (state.role === 'cliente') ownsRequest(requestId); else approvedDriver()
    if (state.role === 'guincheiro' && r.professionalId !== driverSessionId) throw new Error('Este profissional não participa do atendimento.')
    if (!r.professionalId || ['concluído', 'cancelado'].includes(r.status)) throw new Error('O chat fica disponível após a confirmação do atendimento.')
    if (!text.trim()) throw new Error('Digite uma mensagem.')
    return { ...r, messages: [...r.messages, { id: uid(), role: state.role, text: text.trim(), createdAt: new Date().toISOString() }] }
  })

  return <DemoContext.Provider value={{ ...state, clientSessionId, driverSessionId, employeeDemo, registerClient, loginClient, loginDriver, openEmployeeDemo, closeSession, submitDriverApplication, decideApplication, addReview, setRole, updateProfessional, createRequest, sendProposal, counterProposal, rejectProposal, acceptProposal, acceptCounter, changeStatus, sendMessage }}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('DemoProvider ausente')
  return context
}
