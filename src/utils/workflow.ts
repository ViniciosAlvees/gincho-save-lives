import type { Proposal, Status, TowRequest } from '../types'

export const validTransitions: Record<Status, Status[]> = {
  'aguardando propostas': ['proposta recebida', 'cancelado'],
  'proposta recebida': ['negociação', 'confirmado', 'cancelado'],
  'negociação': ['confirmado', 'cancelado'],
  'confirmado': ['a caminho', 'cancelado'],
  'a caminho': ['em andamento', 'cancelado'],
  'em andamento': ['concluído'],
  'concluído': [], 'cancelado': [],
}

export function addProposalToRequest(request: TowRequest, proposal: Proposal): TowRequest {
  if (!['aguardando propostas', 'proposta recebida', 'negociação'].includes(request.status)) throw new Error('Este chamado não aceita novas propostas.')
  if (request.proposals.some(p => p.professionalId === proposal.professionalId && p.status !== 'recusada')) throw new Error('Você já enviou uma proposta para este chamado.')
  return { ...request, status: request.status === 'aguardando propostas' ? 'proposta recebida' : request.status, proposals: [...request.proposals, proposal] }
}

export function confirmProposal(request: TowRequest, proposalId: string, counter = false, professionalId?: string): TowRequest {
  if (!['proposta recebida', 'negociação'].includes(request.status) || request.professionalId) throw new Error('Este atendimento já foi confirmado ou não está disponível.')
  const selected = request.proposals.find(p => p.id === proposalId && (counter ? p.status === 'contraproposta' && p.professionalId === professionalId : p.status === 'pendente'))
  if (!selected || (counter && !selected.counterAmount)) throw new Error('Proposta indisponível.')
  return { ...request, status: 'confirmado', professionalId: selected.professionalId, proposals: request.proposals.map(p => ({ ...p, amount: p.id === proposalId && counter ? selected.counterAmount! : p.amount, status: p.id === proposalId ? 'aceita' : 'recusada' })) }
}

export function moveStatus(request: TowRequest, status: Status): TowRequest {
  if (!validTransitions[request.status].includes(status) || ['confirmado', 'proposta recebida', 'negociação'].includes(status)) throw new Error('Transição de status inválida.')
  return { ...request, status }
}
