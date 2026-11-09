import { describe, expect, it } from 'vitest'
import { initialState } from '../mocks/data'
import type { ClientAccount, Review, TowRequest } from '../types'
import { canReview, isActiveClient, isApprovedDriver, isContractable, ratingSummary, validCpf, validPassword, validPlate } from './accessRules'

const account: ClientAccount = { id: 'c-1', name: 'Cliente Teste', email: 'teste@example.test', cpfMasked: '***.***.247-**', status: 'ativo', createdAt: '2026-01-01' }
const request: TowRequest = { id: 'r-1', clientId: 'c-1', clientName: 'Cliente Teste', professionalId: 'g-01', origin: 'A', destination: 'B', vehicle: 'Carro', vehicleDescription: 'Teste', problem: 'Pane', details: '', status: 'concluído', proposals: [], messages: [], createdAt: '2026-01-01' }

describe('cadastro e acesso demonstrativo', () => {
  it('valida CPF, senha e placa sem armazenar credenciais', () => { expect(validCpf('529.982.247-25')).toBe(true); expect(validCpf('111.111.111-11')).toBe(false); expect(validPassword('abc12345')).toBe(true); expect(validPassword('somenteletras')).toBe(false); expect(validPlate('ABC1D23')).toBe(true); expect(validPlate('ABC-1234')).toBe(true); expect(validPlate('A-123')).toBe(false) })
  it('bloqueia cliente inativo e sem sessão', () => { expect(isActiveClient(account, null)).toBe(false); expect(isActiveClient({ ...account, status: 'inativo' }, 'c-1')).toBe(false); expect(isActiveClient({ ...account, status: 'bloqueado' }, 'c-1')).toBe(false); expect(isActiveClient(account, 'c-1')).toBe(true) })
  it('bloqueia motorista não aprovado e não disponível', () => { const p = initialState.professionals[0]; const app = initialState.driverApplications[0]; expect(isApprovedDriver(p, { ...app, status: 'pendente' }, p.id)).toBe(false); expect(isApprovedDriver(p, { ...app, status: 'reprovado' }, p.id)).toBe(false); expect(isApprovedDriver(p, app, null)).toBe(false); expect(isContractable({ ...p, available: false }, app)).toBe(false); expect(isContractable(p, { ...app, status: 'em análise' })).toBe(false); expect(isContractable(p, app)).toBe(true) })
})

describe('avaliação após atendimento', () => {
  const review: Review = { id: 'v-1', requestId: 'r-1', professionalId: 'g-01', clientId: 'c-1', score: 5, comment: 'Teste', createdAt: '2026-01-02', demo: true }
  it('permite apenas o cliente vinculado, após conclusão e uma única vez', () => { expect(canReview(request, 'c-1', [])).toBe(true); expect(canReview({ ...request, status: 'em andamento' }, 'c-1', [])).toBe(false); expect(canReview(request, 'outro', [])).toBe(false); expect(canReview(request, 'c-1', [review])).toBe(false) })
  it('calcula média e distribuição a partir das avaliações', () => { expect(ratingSummary([review, { ...review, id: 'v-2', score: 3 }])).toEqual({ count: 2, average: 4, distribution: [{ score: 5, count: 1 }, { score: 4, count: 0 }, { score: 3, count: 1 }, { score: 2, count: 0 }, { score: 1, count: 0 }] }) })
})
