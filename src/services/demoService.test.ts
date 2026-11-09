import { beforeEach, describe, expect, it, vi } from 'vitest'
import { demoService, loadDemoState } from './demoService'

const storage = new Map<string, string>()

beforeEach(() => {
  storage.clear()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => { storage.set(key, value) },
  })
})

describe('provider demo', () => {
  it('persiste solicitações e propostas e impede proposta duplicada', async () => {
    const request = await demoService.createRequest({ origin: 'Rua A, 100', destination: 'Rua B, 200', vehicle: 'Carro', vehicleDescription: 'Hatch', problem: 'Pane', details: '' })
    expect((await demoService.getRequests()).map(item => item.id)).toContain(request.id)
    await demoService.createProposal(request.id, { professionalId: 'g-01', amount: 180, note: 'Teste' })
    await expect(demoService.createProposal(request.id, { professionalId: 'g-01', amount: 190, note: 'Duplicada' })).rejects.toThrow(/já enviou/)
    expect(loadDemoState().requests[0].status).toBe('proposta recebida')
  })
})
