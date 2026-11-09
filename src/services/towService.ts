import type { NewRequest, Professional, Proposal, TowRequest } from '../types'

export interface TowService {
  getProfessionals(): Promise<Professional[]>
  getRequests(): Promise<TowRequest[]>
  createRequest(data: NewRequest): Promise<TowRequest>
  updateRequest(id: string, data: Partial<TowRequest>): Promise<TowRequest>
  createProposal(requestId: string, data: Pick<Proposal, 'amount' | 'note' | 'professionalId'>): Promise<Proposal>
  updateProposal(requestId: string, proposalId: string, data: Partial<Proposal>): Promise<Proposal>
  updateProfessional(id: string, data: Partial<Professional>): Promise<Professional>
}

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  if (!base) throw new Error('VITE_API_BASE_URL não configurada. O modo API não usa dados demonstrativos como fallback.')
  let response: Response
  try {
    response = await fetch(`${base}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
  } catch { throw new Error('Falha de rede ao acessar a API. Verifique a conexão e o servidor Java.') }
  if (!response.ok) throw new Error(`API indisponível: HTTP ${response.status}.`)
  if (response.status === 204) throw new Error('A API não retornou conteúdo para esta operação.')
  return response.json() as Promise<T>
}

export const apiService: TowService = {
  getProfessionals: () => request('/guincheiros'),
  getRequests: () => request('/solicitacoes'),
  createRequest: data => request('/solicitacoes', { method: 'POST', body: JSON.stringify(data) }),
  updateRequest: (id, data) => request(`/solicitacoes/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  createProposal: (id, data) => request(`/solicitacoes/${encodeURIComponent(id)}/propostas`, { method: 'POST', body: JSON.stringify(data) }),
  updateProposal: (id, proposalId, data) => request(`/solicitacoes/${encodeURIComponent(id)}/propostas/${encodeURIComponent(proposalId)}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateProfessional: (id, data) => request(`/guincheiros/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
}

export const isApiMode = import.meta.env.VITE_APP_MODE === 'api'
