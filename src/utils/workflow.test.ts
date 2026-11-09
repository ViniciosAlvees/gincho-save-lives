import { describe, expect, it } from 'vitest'
import type { Proposal, TowRequest } from '../types'
import { addProposalToRequest, confirmProposal, moveStatus } from './workflow'

const proposal: Proposal = { id: 'p1', professionalId: 'g1', amount: 180, note: 'Teste', status: 'pendente', createdAt: '2026-11-09T12:00:00Z' }
const base: TowRequest = { id: 'r1', clientName: 'Cliente', origin: 'Rua A', destination: 'Rua B', vehicle: 'Carro', vehicleDescription: 'Hatch', problem: 'Pane', details: '', status: 'aguardando propostas', proposals: [], messages: [], createdAt: '2026-11-09T12:00:00Z' }

describe('fluxo de negociação', () => {
  it('recebe uma proposta e rejeita duplicatas do mesmo profissional', () => {
    const first = addProposalToRequest(base, proposal)
    expect(first.status).toBe('proposta recebida')
    expect(() => addProposalToRequest(first, { ...proposal, id: 'p2' })).toThrow(/já enviou/)
  })
  it('confirma apenas uma proposta e recusa as outras', () => {
    const request = { ...base, status: 'proposta recebida' as const, proposals: [proposal, { ...proposal, id: 'p2', professionalId: 'g2' }] }
    const confirmed = confirmProposal(request, 'p1')
    expect(confirmed.professionalId).toBe('g1')
    expect(confirmed.proposals.map(p => p.status)).toEqual(['aceita','recusada'])
    expect(() => confirmProposal(confirmed, 'p2')).toThrow()
    expect(() => confirmProposal({ ...request, proposals: [{ ...proposal, status: 'contraproposta' }] }, 'p1')).toThrow()
  })
  it('aceita contraproposta apenas pelo profissional destinatário', () => {
    const request = { ...base, status: 'negociação' as const, proposals: [{ ...proposal, status: 'contraproposta' as const, counterAmount: 150 }] }
    expect(() => confirmProposal(request, 'p1', true, 'g2')).toThrow()
    expect(confirmProposal(request, 'p1', true, 'g1').proposals[0].amount).toBe(150)
  })
  it('impede saltos de status e alterações após conclusão', () => {
    expect(() => moveStatus(base, 'concluído')).toThrow()
    const confirmed = { ...base, status: 'confirmado' as const }
    expect(moveStatus(confirmed, 'a caminho').status).toBe('a caminho')
    expect(() => moveStatus({ ...base, status: 'concluído' }, 'cancelado')).toThrow()
  })
})
