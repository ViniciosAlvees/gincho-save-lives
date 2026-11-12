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
    response = await fetch(`${base}${path}`, { credentials: 'include', signal: AbortSignal.timeout(15000), ...options, headers: { 'Content-Type': 'application/json', ...options?.headers } })
  } catch { throw new Error('Falha de rede ou tempo esgotado ao acessar a API. Verifique a conexão e o servidor Java.') }
  if (!response.ok) throw new Error(`API indisponível: HTTP ${response.status}.`)
  if (response.status === 204) throw new Error('A API não retornou conteúdo para esta operação.')
  try { return await response.json() as T }
  catch { throw new Error('A API retornou uma resposta JSON inválida.') }
}

export const apiService: TowService = {
  getProfessionals: async () => {
    const data = await request<unknown>('/guincheiros')
    if (!Array.isArray(data) || !data.every(isProfessional)) throw new Error('O servidor retornou uma lista de profissionais em formato inesperado. Entre em contato com a equipe.')
    return data
  },
  getRequests: () => request('/solicitacoes'),
  createRequest: async data => {
    const result = await request<TowRequest>('/solicitacoes', { method: 'POST', body: JSON.stringify(data) })
    if (!result || typeof result.id !== 'string' || typeof result.status !== 'string') throw new Error('A resposta não confirma o protocolo e o status da solicitação. Confira o backend antes de reenviar para evitar duplicidade.')
    return result
  },
  updateRequest: (id, data) => request(`/solicitacoes/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
  createProposal: (id, data) => request(`/solicitacoes/${encodeURIComponent(id)}/propostas`, { method: 'POST', body: JSON.stringify(data) }),
  updateProposal: (id, proposalId, data) => request(`/solicitacoes/${encodeURIComponent(id)}/propostas/${encodeURIComponent(proposalId)}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateProfessional: (id, data) => request(`/guincheiros/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(data) }),
}

function isProfessional(value: unknown): value is Professional {
  if (!value || typeof value !== 'object') return false
  const p = value as Record<string, unknown>
  return ['id', 'name', 'region', 'city', 'about', 'towType'].every(key => typeof p[key] === 'string')
    && typeof p.price === 'number' && Number.isFinite(p.price) && p.price >= 0
    && typeof p.available === 'boolean' && Array.isArray(p.vehicles) && p.vehicles.every(vehicle => typeof vehicle === 'string')
    && typeof p.lat === 'number' && typeof p.lng === 'number' && typeof p.jobs === 'number' && typeof p.demo === 'boolean'
}

export const isApiMode = import.meta.env.VITE_APP_MODE === 'api'
