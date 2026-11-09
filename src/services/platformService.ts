import type { ApprovalStatus, ClientAccount, DriverApplication, DocumentKind, Review } from '../types'

// Contrato provisório: caminhos, autenticação e payloads serão alinhados com a equipe backend.
// Nunca chamar estas operações no modo demo; documentos reais exigem backend privado.
export interface PlatformService {
  registerClient(data: { cpf: string; name: string; email: string; password: string }): Promise<ClientAccount>
  loginClient(data: { email: string; password: string }): Promise<void>
  registerDriver(data: Record<string, string>): Promise<DriverApplication>
  loginDriver(data: { email: string; password: string }): Promise<void>
  uploadDocument(driverId: string, kind: DocumentKind, file: File): Promise<void>
  listApplications(): Promise<DriverApplication[]>
  decideApplication(id: string, status: ApprovalStatus, note: string): Promise<DriverApplication>
  getReviews(professionalId: string): Promise<Review[]>
  addReview(requestId: string, data: { score: number; comment: string }): Promise<Review>
}

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || ''
async function call<T>(path: string, init: RequestInit): Promise<T> {
  if (!base) throw new Error('Configure VITE_API_BASE_URL para usar a API futura.')
  const response = await fetch(`${base}${path}`, { ...init, credentials: 'include' })
  if (!response.ok) throw new Error(`API indisponível: HTTP ${response.status}.`)
  return response.status === 204 ? undefined as T : response.json() as Promise<T>
}
const json = (method: string, body: unknown): RequestInit => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

export const futurePlatformApi: PlatformService = {
  registerClient: data => call('/clientes', json('POST', data)),
  loginClient: data => call('/clientes/sessao', json('POST', data)),
  registerDriver: data => call('/guincheiros/cadastros', json('POST', data)),
  loginDriver: data => call('/guincheiros/sessao', json('POST', data)),
  uploadDocument: (id, kind, file) => { const body = new FormData(); body.append('arquivo', file); return call(`/guincheiros/cadastros/${encodeURIComponent(id)}/documentos/${kind}`, { method: 'POST', body }) },
  listApplications: () => call('/funcionarios/cadastros', { method: 'GET' }),
  decideApplication: (id, status, note) => call(`/funcionarios/cadastros/${encodeURIComponent(id)}/decisao`, json('POST', { status, note })),
  getReviews: id => call(`/guincheiros/${encodeURIComponent(id)}/avaliacoes`, { method: 'GET' }),
  addReview: (id, data) => call(`/solicitacoes/${encodeURIComponent(id)}/avaliacao`, json('POST', data)),
}
