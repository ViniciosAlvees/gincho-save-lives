import { initialState } from '../mocks/data'
import type { DemoState, NewRequest, Professional, Proposal, TowRequest } from '../types'
import { addProposalToRequest, confirmProposal, moveStatus } from '../utils/workflow'
import type { TowService } from './towService'

const STORAGE_KEY = 'gsl-demo-v1'

export function loadDemoState(): DemoState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialState
    const parsed = JSON.parse(saved) as DemoState
    if (!Array.isArray(parsed.professionals) || !Array.isArray(parsed.requests)) return initialState
    const driverApplications = Array.isArray(parsed.driverApplications) ? parsed.driverApplications : initialState.driverApplications
    return { ...initialState, ...parsed, clientAccounts: Array.isArray(parsed.clientAccounts) ? parsed.clientAccounts : [], driverApplications, reviews: Array.isArray(parsed.reviews) ? parsed.reviews : initialState.reviews, professionals: parsed.professionals.map(p => ({ ...p, approvalStatus: driverApplications.find(a => a.professionalId === p.id)?.status || 'pendente', available: !!p.available && driverApplications.some(a => a.professionalId === p.id && a.status === 'aprovado') })) }
  } catch { return initialState }
}

export function saveDemoState(state: DemoState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, professionals: state.professionals.map(p => ({ ...p, phone: undefined })) }))
}

function updateStoredRequest(id: string, transform: (request: TowRequest) => TowRequest): TowRequest {
  const state = loadDemoState()
  const request = state.requests.find(item => item.id === id)
  if (!request) throw new Error('Solicitação não encontrada.')
  const updated = transform(request)
  saveDemoState({ ...state, requests: state.requests.map(item => item.id === id ? updated : item) })
  return updated
}

// Provider local com o mesmo contrato do provider HTTP. O Context usa estas
// funções de armazenamento; a UI mantém atualizações síncronas para o fluxo demo.
export const demoService: TowService = {
  getProfessionals: async () => loadDemoState().professionals,
  getRequests: async () => loadDemoState().requests,
  createRequest: async (data: NewRequest) => {
    const state = loadDemoState()
    const created: TowRequest = { ...data, id: crypto.randomUUID(), clientName: state.clientName, status: 'aguardando propostas', proposals: [], messages: [], createdAt: new Date().toISOString() }
    saveDemoState({ ...state, requests: [created, ...state.requests] })
    return created
  },
  updateRequest: async (id, data) => updateStoredRequest(id, request => {
    if (data.status && data.status !== request.status) return { ...moveStatus(request, data.status), ...data }
    return { ...request, ...data, id: request.id }
  }),
  createProposal: async (requestId, data) => {
    if (!Number.isFinite(data.amount) || data.amount <= 0) throw new Error('Informe um valor maior que zero.')
    const proposal: Proposal = { ...data, id: crypto.randomUUID(), status: 'pendente', createdAt: new Date().toISOString() }
    updateStoredRequest(requestId, request => addProposalToRequest(request, proposal))
    return proposal
  },
  updateProposal: async (requestId, proposalId, data) => {
    const updated = updateStoredRequest(requestId, request => {
      if (data.status === 'aceita') return confirmProposal(request, proposalId)
      if (!['proposta recebida', 'negociação'].includes(request.status)) throw new Error('Negociação encerrada.')
      if (!request.proposals.some(proposal => proposal.id === proposalId && proposal.status === 'pendente')) throw new Error('Proposta indisponível.')
      return { ...request, status: data.status === 'contraproposta' ? 'negociação' : request.status, proposals: request.proposals.map(proposal => proposal.id === proposalId ? { ...proposal, ...data, id: proposal.id } : proposal) }
    })
    return updated.proposals.find(proposal => proposal.id === proposalId)!
  },
  updateProfessional: async (id, data) => {
    const state = loadDemoState()
    const existing = state.professionals.find(p => p.id === id)
    if (!existing) throw new Error('Profissional não encontrado.')
    const updated: Professional = { ...existing, ...data, id }
    saveDemoState({ ...state, professionals: state.professionals.map(p => p.id === id ? updated : p) })
    return updated
  },
}
